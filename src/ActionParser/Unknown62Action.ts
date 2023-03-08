import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface Unknown62Action extends AbstractActionData {
  unknownA: number;
  unknownB: number;
  unknownC: number;
}

export class Unknown62Converter extends AbstractActionConverter {
  public static readonly type = 0x62;

  public assembly(data: Unknown62Action): Uint8Array {
    const byteBuffer = new DataBuffer(13, true);

    byteBuffer.writeUint8(Unknown62Converter.type);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeUint32(data.unknownC);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): Unknown62Action {
    return {
      type: Unknown62Converter.type,
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
      unknownC: byteBuffer.readUint32(),
    };
  }
}
