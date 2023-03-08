import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface PositionAbilityActionData extends AbstractActionData {
  flags: number;
  itemId: number;
  unknownA: number;
  unknownB: number;
  x: number;
  y: number;
}

export class PositionAbilityActionConverter extends AbstractActionConverter {
  public static readonly type = 0x11;

  public assembly(data: PositionAbilityActionData): Uint8Array {
    const byteBuffer = new DataBuffer(23, true);

    byteBuffer.writeUint8(PositionAbilityActionConverter.type);
    byteBuffer.writeUint16(data.flags);
    byteBuffer.writeUint32(data.itemId);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeUint32(data.x);
    byteBuffer.writeUint32(data.y);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): PositionAbilityActionData {
    return {
      type: PositionAbilityActionConverter.type,
      flags: byteBuffer.readUint16(),
      itemId: byteBuffer.readUint32(),
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
      x: byteBuffer.readUint32(),
      y: byteBuffer.readUint32(),
    };
  }
}
