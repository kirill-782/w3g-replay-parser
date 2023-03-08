import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface SelectSubGroupAction extends AbstractActionData {
  itemId: number;
  objectId1: number;
  objectId2: number;
}

export class SelectSubGroupConverter extends AbstractActionConverter {
  public static readonly type = 0x19;

  public assembly(data: SelectSubGroupAction): Uint8Array {
    const byteBuffer = new DataBuffer(13, true);

    byteBuffer.writeUint8(SelectSubGroupConverter.type);
    byteBuffer.writeUint32(data.itemId);
    byteBuffer.writeUint32(data.objectId1);
    byteBuffer.writeUint32(data.objectId2);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SelectSubGroupAction {
    return {
      type: SelectSubGroupConverter.type,
      itemId: byteBuffer.readUint32(),
      objectId1: byteBuffer.readUint32(),
      objectId2: byteBuffer.readUint32(),
    };
  }
}
