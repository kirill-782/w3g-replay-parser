import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface SelectGroudItemAction extends AbstractActionData {
  unknownA: number;
  objectId1: number;
  objectId2: number;
}

export class SelectGroudItemConverter extends AbstractActionConverter {
  public static readonly type = 0x1c;

  public assembly(data: SelectGroudItemAction): Uint8Array {
    const byteBuffer = new DataBuffer(10, true);

    byteBuffer.writeUint8(SelectGroudItemConverter.type);
    byteBuffer.writeUint8(data.unknownA);
    byteBuffer.writeUint32(data.objectId1);
    byteBuffer.writeUint32(data.objectId2);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SelectGroudItemAction {
    return {
      type: SelectGroudItemConverter.type,
      unknownA: byteBuffer.readUint8(),
      objectId1: byteBuffer.readUint32(),
      objectId2: byteBuffer.readUint32(),
    };
  }
}
