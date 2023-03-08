import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface AssignGroupHotkeyAction extends AbstractActionData {
  group: number;
  objects: {
    objectId1: number;
    objectId2: number;
  }[];
}

export class AssignGroupHotkeyConverter extends AbstractActionConverter {
  public static readonly type = 0x17;

  public assembly(data: AssignGroupHotkeyAction): Uint8Array {
    const byteBuffer = new DataBuffer(4 + 8 * data.objects.length, true);

    byteBuffer.writeUint8(AssignGroupHotkeyConverter.type);
    byteBuffer.writeUint8(data.group);
    byteBuffer.writeUint16(data.objects.length);

    for (const obj of data.objects) {
      byteBuffer.writeUint32(obj.objectId1);
      byteBuffer.writeUint32(obj.objectId2);
    }

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): AssignGroupHotkeyAction {
    const group = byteBuffer.readUint8();
    const count = byteBuffer.readUint16();
    const objects = [];

    for (let i = 0; i < count; ++i) {
      objects.push({
        objectId1: byteBuffer.readUint32(),
        objectId2: byteBuffer.readUint32(),
      });
    }

    return {
      type: AssignGroupHotkeyConverter.type,
      group,
      objects,
    };
  }
}
