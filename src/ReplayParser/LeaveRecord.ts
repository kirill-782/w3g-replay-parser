import { DataBuffer } from "../DataBuffer";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface LeaveRecord extends AbstractRecord {
  reason: number;
  playerId: number;
  result: number;
  unknown: number;
}

export class LeaveRecordConverter extends AbstractRecordConverter {
  public static readonly type = 0x17;

  public checkEnough(data: DataBuffer): boolean {
    return data.offset + 13 <= data.limit;
  }

  public assembly(data: LeaveRecord): Uint8Array {
    const bytebuffer = new DataBuffer(14, true);

    bytebuffer.writeUint8(LeaveRecordConverter.type);
    bytebuffer.writeUint32(data.reason);
    bytebuffer.writeUint8(data.playerId);
    bytebuffer.writeUint32(data.result);
    bytebuffer.writeUint32(data.unknown);

    return bytebuffer.buffer;
  }

  public parse(dataBuffer: DataBuffer): LeaveRecord {
    return {
      type: LeaveRecordConverter.type,
      reason: dataBuffer.readUint32(),
      playerId: dataBuffer.readUint8(),
      result: dataBuffer.readUint32(),
      unknown: dataBuffer.readUint32(),
    };
  }
}
