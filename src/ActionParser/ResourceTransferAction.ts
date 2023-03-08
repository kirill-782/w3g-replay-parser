import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface ResourceTransferAction extends AbstractActionData {
  slotId: number;
  gold: number;
  lumber: number;
}

export class ResourceTransferConverter extends AbstractActionConverter {
  public static readonly type = 0x51;

  public assembly(data: ResourceTransferAction): Uint8Array {
    const byteBuffer = new DataBuffer(10, true);

    byteBuffer.writeUint8(ResourceTransferConverter.type);
    byteBuffer.writeUint8(data.slotId);
    byteBuffer.writeUint32(data.gold);
    byteBuffer.writeUint32(data.lumber);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): ResourceTransferAction {
    return {
      type: ResourceTransferConverter.type,
      slotId: byteBuffer.readUint8(),
      gold: byteBuffer.readUint32(),
      lumber: byteBuffer.readUint32(),
    };
  }
}
