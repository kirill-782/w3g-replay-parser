import { DataBuffer } from "../DataBuffer";
import { SlotInfo, SlotInfoConverter } from "../Utils/SlotInfo";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface ReforgedRecord extends AbstractRecord {
  subType: number;
  unknown: Uint8Array;
}

export class ReforgedRecordConverter extends AbstractRecordConverter {
  public static readonly type = 0x39;

  public checkEnough(data: DataBuffer): boolean {
    return !(
      data.offset + 5 > data.limit ||
      data.offset + data.readUint32(data.offset + 1) > data.limit
    );
  }

  public assembly(data: ReforgedRecord): Uint8Array {
    const databuffer = new DataBuffer(3 + data.unknown.byteLength);

    databuffer.writeUint8(ReforgedRecordConverter.type);
    databuffer.writeUint8(data.subType);
    databuffer.writeUint8(data.unknown.byteLength);
    databuffer.append(data.unknown);

    return databuffer.buffer;
  }

  public parse(dataBuffer: DataBuffer): ReforgedRecord {
    const subType = dataBuffer.readUint8();
    const followingBytes = dataBuffer.readUint32();

    return {
      type: 0x39,
      subType,
      unknown: dataBuffer.readBytes(followingBytes).toBuffer(),
    };
  }
}
