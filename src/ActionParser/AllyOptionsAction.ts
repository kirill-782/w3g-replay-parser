import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface AllyOptionsAction extends AbstractActionData {
  slotId: number;
  flags: number;
}

export class AllyOptionsConverter extends AbstractActionConverter {
  public static readonly type = 0x50;

  public assembly(data: AllyOptionsAction): Uint8Array {
    const byteBuffer = new DataBuffer(6, true);

    byteBuffer.writeUint8(AllyOptionsConverter.type);
    byteBuffer.writeUint8(data.slotId);
    byteBuffer.writeUint32(data.flags);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): AllyOptionsAction {
    return {
      type: AllyOptionsConverter.type,
      slotId: byteBuffer.readUint8(),
      flags: byteBuffer.readUint32(),
    };
  }
}
