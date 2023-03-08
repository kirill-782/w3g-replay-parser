import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface SetGameSpeedAction extends AbstractActionData {
  speed: number;
}

export class SetGameSpeedConverter extends AbstractActionConverter {
  public static readonly type = 0x03;

  public assembly(data: SetGameSpeedAction): Uint8Array {
    const byteBuffer = new DataBuffer(2, true);

    byteBuffer.writeUint8(SetGameSpeedConverter.type);
    byteBuffer.writeUint8(data.speed);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SetGameSpeedAction {
    return {
      type: SetGameSpeedConverter.type,
      speed: byteBuffer.readUint8(),
    };
  }
}
