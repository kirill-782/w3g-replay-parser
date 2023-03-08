import { DataBuffer } from "../DataBuffer";

export interface SubHeaderData {
  productId: number;
  version: number;
  buildNumber: number;
  flags: number;
  lengthMilis: number;
  crc32: Uint8Array;
}

export class SubHeaderConverter {
  public assembly(subHeaderData: SubHeaderData): Uint8Array {
    const buffer = new DataBuffer(20, true);

    buffer.writeUint32(subHeaderData.productId);
    buffer.writeUint32(subHeaderData.version);
    buffer.writeUint16(subHeaderData.buildNumber);
    buffer.writeUint16(subHeaderData.flags);
    buffer.writeUint32(subHeaderData.lengthMilis);
    buffer.append(subHeaderData.crc32);

    return buffer.buffer;
  }

  public parse(bytebuffer: DataBuffer): SubHeaderData {
    return {
      productId: bytebuffer.readUint32(),
      version: bytebuffer.readUint32(),
      buildNumber: bytebuffer.readUint16(),
      flags: bytebuffer.readUint16(),
      lengthMilis: bytebuffer.readUint32(),
      crc32: bytebuffer.readBytes(4).toBuffer(),
    };
  }
}
