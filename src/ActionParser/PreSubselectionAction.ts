import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface PreSubselectionAction extends AbstractActionData {}

export class PreSubselectionConverter extends AbstractActionConverter {
  public static readonly type = 0x1a;

  public assembly(data: PreSubselectionAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(PreSubselectionConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): PreSubselectionAction {
    return {
      type: PreSubselectionConverter.type,
    };
  }
}
