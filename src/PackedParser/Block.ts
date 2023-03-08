import { DataBuffer } from "../DataBuffer";
import { SubHeaderData } from "./SubHeader";

export interface BlockData {
  decompressedBlockSize: number;
  data: Uint8Array;
}

export class BlockConverter {
  private subHeaderData: SubHeaderData;

  constructor(subHeaderData: SubHeaderData) {
    this.subHeaderData = subHeaderData;
  }

  public assembly(blockData: BlockData): Uint8Array {
    const bytebuffer = new DataBuffer(
      blockData.data.byteLength + 8 + (this.isReforged() && 8),
      true
    );

    bytebuffer.writeUint16(blockData.data.byteLength);

    if (this.isReforged()) {
      bytebuffer.skip(2);
    }

    bytebuffer.writeUint16(blockData.decompressedBlockSize);
    bytebuffer.skip(this.isReforged() ? 6 : 4);
    bytebuffer.append(blockData.data);

    return bytebuffer.buffer;
  }

  public parse(bytebuffer: DataBuffer): BlockData {
    const dataLength = bytebuffer.readUint16();

    if (this.isReforged()) {
      bytebuffer.skip(2);
    }

    const decompressedBlockSize = bytebuffer.readUint16();
    bytebuffer.skip(this.isReforged() ? 6 : 4);

    const data = bytebuffer.readBytes(dataLength).toBuffer();

    return {
      decompressedBlockSize,
      data,
    };
  }

  public isReforged() {
    return this.subHeaderData.version > 31;
  }
}
