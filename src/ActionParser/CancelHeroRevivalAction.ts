import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface CancelHeroRevivalAction extends AbstractActionData {
  unitId1: number;
  unitId2: number;
}

export class CancelHeroRevivalConverter extends AbstractActionConverter {
  public static readonly type = 0x1d;

  public assembly(data: CancelHeroRevivalAction): Uint8Array {
    const byteBuffer = new DataBuffer(9, true);

    byteBuffer.writeUint8(CancelHeroRevivalConverter.type);
    byteBuffer.writeUint32(data.unitId1);
    byteBuffer.writeUint32(data.unitId2);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): CancelHeroRevivalAction {
    return {
      type: CancelHeroRevivalConverter.type,
      unitId1: byteBuffer.readUint32(),
      unitId2: byteBuffer.readUint32(),
    };
  }
}
