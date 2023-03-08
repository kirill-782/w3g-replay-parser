import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface ItemAction extends AbstractActionData {
  flags: number;
  itemId: number;
  unknownA: number;
  unknownB: number;
  targetX: number;
  targetY: number;
  objectId1: number;
  objectId2: number;
  itemObjectId1: number;
  itemObjectId2: number;
}

export class ItemActionConverter extends AbstractActionConverter {
  public static readonly type = 0x13;

  public assembly(data: ItemAction): Uint8Array {
    const byteBuffer = new DataBuffer(33, true);

    byteBuffer.writeUint8(ItemActionConverter.type);
    byteBuffer.writeUint16(data.flags);
    byteBuffer.writeUint32(data.itemId);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeUint32(data.targetX);
    byteBuffer.writeUint32(data.targetY);
    byteBuffer.writeUint32(data.objectId1);
    byteBuffer.writeUint32(data.objectId2);
    byteBuffer.writeUint32(data.itemObjectId1);
    byteBuffer.writeUint32(data.itemObjectId2);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): ItemAction {
    return {
      type: ItemActionConverter.type,
      flags: byteBuffer.readUint16(),
      itemId: byteBuffer.readUint32(),
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
      targetX: byteBuffer.readUint32(),
      targetY: byteBuffer.readUint32(),
      objectId1: byteBuffer.readUint32(),
      objectId2: byteBuffer.readUint32(),
      itemObjectId1: byteBuffer.readUint32(),
      itemObjectId2: byteBuffer.readUint32(),
    };
  }
}
