import { DataBuffer } from "../DataBuffer";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface UnknownRecord extends AbstractRecord {
  unknown: number;
}

export class UnknownRecordConverter extends AbstractRecordConverter {
  public checkEnough(data: DataBuffer): boolean {
    return !(data.offset + 4 > data.limit);
  }

  public assembly(data: UnknownRecord): Uint8Array {
    const bytebuffer = new DataBuffer(5, true);

    bytebuffer.writeUint8(data.type);
    bytebuffer.writeUint32(data.unknown);

    return bytebuffer.buffer;
  }

  public parse(dataBuffer: DataBuffer): UnknownRecord {
    return {
      type: dataBuffer.readUint8(dataBuffer.offset - 1),
      unknown: dataBuffer.readUint32(),
    };
  }
}
