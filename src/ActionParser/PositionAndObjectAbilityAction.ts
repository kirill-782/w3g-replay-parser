import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface PositionAndObjectAbilityAction extends AbstractActionData {
  flags: number;
  itemId: number;
  unknownA: number;
  unknownB: number;
  targetX: number;
  targetY: number;
  objectId1: number;
  objectId2: number;
}

export class PositionAndObjectAbilityActionConverter extends AbstractActionConverter {
  public static readonly type = 0x12;

  public assembly(data: PositionAndObjectAbilityAction): Uint8Array {
    const byteBuffer = new DataBuffer(31, true);

    byteBuffer.writeUint8(PositionAndObjectAbilityActionConverter.type);
    byteBuffer.writeUint16(data.flags);
    byteBuffer.writeUint32(data.itemId);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeUint32(data.targetX);
    byteBuffer.writeUint32(data.targetY);
    byteBuffer.writeUint32(data.objectId1);
    byteBuffer.writeUint32(data.objectId2);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): PositionAndObjectAbilityAction {
    return {
      type: PositionAndObjectAbilityActionConverter.type,
      flags: byteBuffer.readUint16(),
      itemId: byteBuffer.readUint32(),
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
      targetX: byteBuffer.readUint32(),
      targetY: byteBuffer.readUint32(),
      objectId1: byteBuffer.readUint32(),
      objectId2: byteBuffer.readUint32(),
    };
  }
}
