import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface AbilityTwoTargetTwoItemActionData extends AbstractActionData {
  flags: number;
  itemIdA: number;
  unknownA: number;
  unknownB: number;
  targetAX: number;
  targetAY: number;
  itemIdB: number;
  unknownC: Uint8Array;
  targetBX: number;
  targetBY: number;
}

export class AbilityTwoTargetTwoItemActionConverter extends AbstractActionConverter {
  public static readonly type = 0x14;

  public assembly(data: AbilityTwoTargetTwoItemActionData): Uint8Array {
    const byteBuffer = new DataBuffer(44, true);

    byteBuffer.writeUint8(AbilityTwoTargetTwoItemActionConverter.type);
    byteBuffer.writeUint16(data.flags);
    byteBuffer.writeUint32(data.itemIdA);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeUint32(data.targetAX);
    byteBuffer.writeUint32(data.targetAY);
    byteBuffer.writeUint32(data.itemIdB);
    byteBuffer.append(data.unknownC);
    byteBuffer.writeUint32(data.targetBX);
    byteBuffer.writeUint32(data.targetBY);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): AbilityTwoTargetTwoItemActionData {
    return {
      type: AbilityTwoTargetTwoItemActionConverter.type,
      flags: byteBuffer.readUint16(),
      itemIdA: byteBuffer.readUint32(),
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
      targetAX: byteBuffer.readUint32(),
      targetAY: byteBuffer.readUint32(),
      itemIdB: byteBuffer.readUint32(),
      unknownC: byteBuffer.readBytes(9).toBuffer(),
      targetBX: byteBuffer.readUint32(),
      targetBY: byteBuffer.readUint32(),
    };
  }
}
