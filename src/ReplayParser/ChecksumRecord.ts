import { DataBuffer } from "../DataBuffer";
import { SlotInfo, SlotInfoConverter } from "../Utils/SlotInfo";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface ChecksumRecord extends AbstractRecord {
  checksum: number;
  unknown: Uint8Array;
}

export class ChecksumRecordConverter extends AbstractRecordConverter{
  public static readonly type = 0x22;

  public checkEnough(data: DataBuffer): boolean {
    return !(
      data.offset + 1 > data.limit ||
      data.offset + data.readUint8(data.offset) + 1 > data.limit
    );
  }

  public assembly(data: ChecksumRecord): Uint8Array {
    const databuffer = new DataBuffer(2 + 4 + data.unknown.byteLength);

    databuffer.writeUint8(ChecksumRecordConverter.type);
    databuffer.writeUint8(4 + data.unknown.byteLength);

    databuffer.writeUint32(data.checksum);
    databuffer.append(data.unknown);

    return databuffer.buffer;
  }

  public parse(dataBuffer: DataBuffer): ChecksumRecord {
    const followingLength = dataBuffer.readUint8();

    return {
      type: ChecksumRecordConverter.type,
      checksum: dataBuffer.readUint32(),
      unknown: dataBuffer.readBytes(followingLength - 4).toBuffer(),
    };
  }
}
