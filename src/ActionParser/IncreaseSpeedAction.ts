import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface IncreaseSpeedAction extends AbstractActionData {}

export class IncreaseSpeedConverter extends AbstractActionConverter {
  public static readonly type = 0x04;

  public assembly(data: IncreaseSpeedAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(IncreaseSpeedConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): IncreaseSpeedAction {
    return {
      type: IncreaseSpeedConverter.type,
    };
  }
}
