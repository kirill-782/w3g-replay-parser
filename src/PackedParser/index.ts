import { DataBuffer } from "../DataBuffer";
import { BlockConverter, BlockData } from "./Block";
import { HeaderConverter, HeaderData } from "./Header";
import { SubHeaderConverter, SubHeaderData } from "./SubHeader";

const REPLAY_MAGIC_HEADER = "Warcraft III recorded game\x1A";

export type Decompressor = (data: Uint8Array) => Uint8Array;

export type Compressor = (data: Uint8Array) => Uint8Array;

export interface PackedData<T> {
  header: HeaderData;
  subHeader: SubHeaderData;
  records: T;
}

export enum RecordProcessState {
  Success,
  NeedMore,
  Complete,
  Error,
}

export interface AbstractRecordsConverter<T> {
  records: T;

  parse: (data: DataBuffer) => RecordProcessState;

  assembly: (dataCallback: (dataPart: Uint8Array) => void) => void;
}

const headerConverter = new HeaderConverter();
const subHeaderConverter = new SubHeaderConverter();

export abstract class PackedConverter<T> {
  protected abstract get recordsConverter(): AbstractRecordsConverter<T>;

  private decompress: Decompressor;

  private compress?: Compressor;

  constructor(decompressor: Decompressor, compressor?: Compressor) {
    this.decompress = decompressor;
    this.compress = compressor;
  }

  public assembly(data: PackedData<T>): Uint8Array {
    if (!this.compress) {
      throw new TypeError("For this operation required compressor");
    }

    const blockConverter = new BlockConverter(data.subHeader);

    const headerBytes = headerConverter.assembly(data.header);
    const subHeaderBytes = subHeaderConverter.assembly(data.subHeader);

    const headerBuffer = new DataBuffer(
      REPLAY_MAGIC_HEADER.length +
        1 +
        headerBytes.byteLength +
        subHeaderBytes.length,
      true
    );

    headerBuffer.writeCString(REPLAY_MAGIC_HEADER);
    headerBuffer.writeBytes(headerBytes);
    headerBuffer.writeBytes(subHeaderBytes);

    // BlockData
    const blocks = new Array<Uint8Array>();

    const uncompressedBlockBuffer = new DataBuffer(8192, true);
    uncompressedBlockBuffer.skip(4); // 4 first unknown bytes

    const onData = (dataPart: Uint8Array, forcePush?: boolean) => {
      if (dataPart.byteLength <= uncompressedBlockBuffer.remaining()) {
        uncompressedBlockBuffer.append(dataPart);

        if (!forcePush) return;
      }

      // Add bytes that will fit in the current block

      const remaining = uncompressedBlockBuffer.remaining();
      uncompressedBlockBuffer.append(dataPart.slice(0, remaining));

      // Pack block

      const blockData: BlockData = {
        data: this.compress(uncompressedBlockBuffer.buffer),
        decompressedBlockSize: uncompressedBlockBuffer.capacity(),
      };

      blocks.push(blockConverter.assembly(blockData));

      // Reset buffer
      uncompressedBlockBuffer.offset = 0;

      // Append remaiming data
      uncompressedBlockBuffer.append(
        dataPart.slice(remaining + 1, dataPart.byteLength)
      );
    };

    this.recordsConverter.assembly(onData);
    onData(new Uint8Array(uncompressedBlockBuffer.remaining())); // Fill null bytes

    // We consider the final size

    const dataSize = blocks.reduce((acc, i) => {
      return acc + i.byteLength;
    }, headerBuffer.buffer.byteLength);

    const resultBuffer = new DataBuffer(dataSize, true);
    resultBuffer.append(headerBuffer.buffer);

    blocks.forEach((i) => {
      resultBuffer.append(i);
    });

    return resultBuffer.buffer;
  }

  public parse(bytebuffer: DataBuffer): PackedData<T> {
    const magicData = bytebuffer.readCString();

    if (magicData !== REPLAY_MAGIC_HEADER)
      throw new Error("Invalid file header");

    const header = headerConverter.parse(bytebuffer);
    const subHeader = subHeaderConverter.parse(bytebuffer);

    let decompressedData = new DataBuffer(8192, true);
    decompressedData.limit = 0;

    const blockConverter = new BlockConverter(subHeader);
    let recordsParsed = 0;

    for (let i = 0; i < header.blockCount; ++i) {
      const blockData = blockConverter.parse(bytebuffer);

      const decompressedDataBlock = this.decompress(blockData.data).slice(
        0,
        blockData.decompressedBlockSize
      );

      this.appendAndCompact(decompressedDataBlock, decompressedData);

      if (i === 0) {
        decompressedData.skip(4);
      }

      if (
        recordsParsed > 0 &&
        decompressedData.offset + 1 < decompressedData.limit &&
        decompressedData.readUint8(decompressedData.offset) === 0
      )
        break;

      const parseResult = this.recordsConverter.parse(decompressedData);

      if (parseResult === RecordProcessState.Error)
        throw new Error("Record converter return error result");
      else if (parseResult === RecordProcessState.Complete) {
        break;
      }
    }

    return {
      header,
      subHeader,
      records: this.recordsConverter.records,
    };
  }

  private appendAndCompact(data: Uint8Array, bb: DataBuffer) {
    bb.compact();
    bb.ensureCapacity(bb.limit + data.length);
    bb.limit += data.length;
    bb.append(data, bb.limit - data.length);

    return;
  }
}
