import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface ArrowKeyAction extends AbstractActionData {
  arrowKey: number;
}

export class ArrowKeyConverter extends AbstractActionConverter {
  public static readonly type = 0x75;

  public assembly(data: ArrowKeyAction): Uint8Array {
    const byteBuffer = new DataBuffer(2, true);

    byteBuffer.writeUint8(ArrowKeyConverter.type);
    byteBuffer.writeUint8(data.arrowKey);
    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): ArrowKeyAction {
    return {
      type: ArrowKeyConverter.type,
      arrowKey: byteBuffer.readUint8(),
    };
  }
}
