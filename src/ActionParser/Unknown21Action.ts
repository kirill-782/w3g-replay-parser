import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface Unknown21Action extends AbstractActionData {
  unknownA: number;
  unknownB: number;
}

export class Unknown21Converter extends AbstractActionConverter {
  public static readonly type = 0x21;

  public assembly(data: Unknown21Action): Uint8Array {
    const byteBuffer = new DataBuffer(9, true);

    byteBuffer.writeUint8(Unknown21Converter.type);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): Unknown21Action {
    return {
      type: Unknown21Converter.type,
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
    };
  }
}
