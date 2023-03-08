import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface Unknown69Action extends AbstractActionData {
  unknownC: number;
  unknownD: number;
  unknownA: number;
  unknownB: number;
}

export class Unknown69Converter extends AbstractActionConverter {
  public static readonly type = 0x69;

  public assembly(data: Unknown69Action): Uint8Array {
    const byteBuffer = new DataBuffer(17, true);

    byteBuffer.writeUint8(Unknown69Converter.type);
    byteBuffer.writeUint32(data.unknownC);
    byteBuffer.writeUint32(data.unknownD);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): Unknown69Action {
    return {
      type: Unknown69Converter.type,
      unknownC: byteBuffer.readUint32(),
      unknownD: byteBuffer.readUint32(),
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
    };
  }
}
