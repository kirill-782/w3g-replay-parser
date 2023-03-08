import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface AbilityActionData extends AbstractActionData {
  flags: number;
  itemId: number;
  unknownA: number;
  unknownB: number;
}

export class AbilityActionConverter extends AbstractActionConverter {
  public static readonly type = 0x10;

  public assembly(data: AbilityActionData): Uint8Array {
    const byteBuffer = new DataBuffer(15, true);

    byteBuffer.writeUint8(AbilityActionConverter.type);
    byteBuffer.writeUint16(data.flags);
    byteBuffer.writeUint32(data.itemId);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): AbilityActionData {
    return {
      type: AbilityActionConverter.type,
      flags: byteBuffer.readUint16(),
      itemId: byteBuffer.readUint32(),
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
    };
  }
}
