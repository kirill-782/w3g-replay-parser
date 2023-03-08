import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";
import { DataBuffer } from "../DataBuffer";

export interface ESCKeyEventAction extends AbstractActionData {}

export class ESCKeyEventConverter extends AbstractActionConverter {
  public static readonly type = 0x61;

  public assembly(data: ESCKeyEventAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(ESCKeyEventConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): ESCKeyEventAction {
    return {
      type: ESCKeyEventConverter.type,
    };
  }
}
