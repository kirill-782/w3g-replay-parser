import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface OpenBuildSubmenuAction extends AbstractActionData {}

export class OpenBuildSubmenuConverter extends AbstractActionConverter {
  public static readonly type = 0x66;

  public assembly(data: OpenBuildSubmenuAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(OpenBuildSubmenuConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): OpenBuildSubmenuAction {
    return {
      type: OpenBuildSubmenuConverter.type,
    };
  }
}
