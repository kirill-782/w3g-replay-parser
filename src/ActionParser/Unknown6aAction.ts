import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface Unknown6aAction extends AbstractActionData {
  unknownA: number;
  unknownB: number;
  unknownC: number;
  unknownD: number;
}

export class Unknown6aConverter extends AbstractActionConverter {
  public static readonly type = 0x6a;

  public assembly(data: Unknown6aAction): Uint8Array {
    const byteBuffer = new DataBuffer(17, true);

    byteBuffer.writeUint8(Unknown6aConverter.type);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeUint32(data.unknownC);
    byteBuffer.writeUint32(data.unknownD);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): Unknown6aAction {
    return {
      type: Unknown6aConverter.type,
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
      unknownC: byteBuffer.readUint32(),
      unknownD: byteBuffer.readUint32(),
    };
  }
}
