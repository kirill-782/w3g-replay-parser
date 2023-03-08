import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface DecreaseSpeedAction extends AbstractActionData {}

export class DecreaseSpeedConverter extends AbstractActionConverter {
  public static readonly type = 0x05;

  public assembly(data: DecreaseSpeedAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(DecreaseSpeedConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): DecreaseSpeedAction {
    return {
      type: DecreaseSpeedConverter.type,
    };
  }
}
