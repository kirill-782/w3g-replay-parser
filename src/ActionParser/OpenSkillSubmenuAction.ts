import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface OpenSkillSubmenuAction extends AbstractActionData {}

export class OpenSkillSubmenuConverter extends AbstractActionConverter {
  public static readonly type = 0x65;

  public assembly(data: OpenSkillSubmenuAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(OpenSkillSubmenuConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): OpenSkillSubmenuAction {
    return {
      type: OpenSkillSubmenuConverter.type,
    };
  }
}
