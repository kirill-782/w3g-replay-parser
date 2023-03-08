import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface ResumeGameAction extends AbstractActionData {}

export class ResumeGameConverter extends AbstractActionConverter {
  public static readonly type = 0x02;

  public assembly(data: ResumeGameAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(ResumeGameConverter.type);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): ResumeGameAction {
    return {
      type: ResumeGameConverter.type,
    };
  }
}
