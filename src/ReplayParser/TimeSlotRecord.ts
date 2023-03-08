import { DataBuffer } from "../DataBuffer";

export interface TimeSlotRecord {
  type: number;
  timeIncrement: number;
  rawData: Uint8Array;
}

export class TimeSlotConverter {
  public assembly(data: TimeSlotRecord): Uint8Array {
    const bytebuffer = new DataBuffer(5 + data.rawData.byteLength, true);

    bytebuffer.writeUint8(data.type);
    bytebuffer.writeUint16(data.rawData.byteLength + 2);
    bytebuffer.writeUint16(data.timeIncrement);
    bytebuffer.writeBytes(data.rawData);

    return bytebuffer.buffer;
  }

  public checkEnough(data: DataBuffer): boolean {
    return !(
      data.offset + 2 > data.limit ||
      data.offset + data.readUint16(data.offset) + 2 > data.limit
    );
  }

  public parse(dataBuffer: DataBuffer): TimeSlotRecord {
    const type = dataBuffer.readUint8(dataBuffer.offset - 1);
    const length = dataBuffer.readUint16();

    return {
      type,
      timeIncrement: dataBuffer.readUint16(),
      rawData: dataBuffer.readBytes(length - 2).toBuffer(),
    };
  }
}
