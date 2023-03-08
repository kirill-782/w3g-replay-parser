import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface SelectGroupHotkeyAction extends AbstractActionData {
  type: 0x18;
  group: number;
  unknown: number;
}

export class SelectGroupHotkeyConverter extends AbstractActionConverter {
  public static readonly type = 0x18;

  public assembly(data: SelectGroupHotkeyAction): Uint8Array {
    const byteBuffer = new DataBuffer(3, true);

    byteBuffer.writeUint8(SelectGroupHotkeyConverter.type);
    byteBuffer.writeUint8(data.group);
    byteBuffer.writeUint8(data.unknown);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SelectGroupHotkeyAction {
    return {
      type: SelectGroupHotkeyConverter.type,
      group: byteBuffer.readUint8(),
      unknown: byteBuffer.readUint8(),
    };
  }
}
