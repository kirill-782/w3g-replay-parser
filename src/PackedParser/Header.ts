import { DataBuffer } from "../DataBuffer";

export interface HeaderData {
  firstBlockOffset: number;
  compressedSize: number;
  headerVersion: number;
  decompressedSize: number;
  blockCount: number;
}

export class HeaderConverter {
  public assembly(headerData: HeaderData): Uint8Array {
    const buffer = new DataBuffer(20, true);

    buffer.writeUint32(headerData.firstBlockOffset);
    buffer.writeUint32(headerData.compressedSize);
    buffer.writeUint32(headerData.headerVersion);
    buffer.writeUint32(headerData.decompressedSize);
    buffer.writeUint32(headerData.blockCount);

    return buffer.buffer;
  }

  public parse(bytebuffer: DataBuffer): HeaderData {
    return {
      firstBlockOffset: bytebuffer.readUint32(),
      compressedSize: bytebuffer.readUint32(),
      headerVersion: bytebuffer.readUint32(),
      decompressedSize: bytebuffer.readUint32(),
      blockCount: bytebuffer.readUint32(),
    };
  }
}
