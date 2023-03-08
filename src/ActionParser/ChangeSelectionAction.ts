import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface ChangeSelectionAction extends AbstractActionData {
  mode: number;
  objects: {
    objectId1: number;
    objectId2: number;
  }[];
}

export class ChangeSelectionConverter extends AbstractActionConverter {
  public static readonly type = 0x16;

  public assembly(data: ChangeSelectionAction): Uint8Array {
    const byteBuffer = new DataBuffer(4 + data.objects.length * 8, true);

    byteBuffer.writeUint8(ChangeSelectionConverter.type);
    byteBuffer.writeUint8(data.mode);
    byteBuffer.writeUint16(data.objects.length);

    for (const obj of data.objects) {
      byteBuffer.writeUint32(obj.objectId1);
      byteBuffer.writeUint32(obj.objectId2);
    }

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): ChangeSelectionAction {
    const mode = byteBuffer.readUint8();
    const count = byteBuffer.readUint16();
    const objects = [];

    for (let i = 0; i < count; ++i) {
      objects.push({
        objectId1: byteBuffer.readUint32(),
        objectId2: byteBuffer.readUint32(),
      });
    }

    return {
      type: ChangeSelectionConverter.type,
      mode,
      objects,
    };
  }
}
