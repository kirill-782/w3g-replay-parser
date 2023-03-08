import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface PauseGameAction extends AbstractActionData {}

export class PauseGameConverter extends AbstractActionConverter {
  public static readonly type = 0x01;

  public assembly(data: PauseGameAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(PauseGameConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): PauseGameAction {
    return {
      type: PauseGameConverter.type,
    };
  }
}
