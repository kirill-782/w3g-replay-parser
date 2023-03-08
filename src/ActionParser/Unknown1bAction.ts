import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface Unknown1bAction extends AbstractActionData {
  unknownA: number;
  unknownB: number;
  unknownC: number;
}

export class Unknown1bConverter extends AbstractActionConverter {
  public static readonly type = 0x1b;

  public assembly(data: Unknown1bAction): Uint8Array {
    const byteBuffer = new DataBuffer(10, true);

    byteBuffer.writeUint8(Unknown1bConverter.type);
    byteBuffer.writeUint8(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeUint32(data.unknownC);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): Unknown1bAction {
    return {
      type: Unknown1bConverter.type,
      unknownA: byteBuffer.readUint8(),
      unknownB: byteBuffer.readUint32(),
      unknownC: byteBuffer.readUint32(),
    };
  }
}
