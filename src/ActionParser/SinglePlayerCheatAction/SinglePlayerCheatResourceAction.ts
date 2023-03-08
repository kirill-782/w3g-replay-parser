import { DataBuffer } from "../../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "../AbstractActionData";

export interface SinglePlayerCheatResourceAction extends AbstractActionData {
  type: number;
  unknown: number;
  count: number;
}

export class SinglePlayerCheatResourceConverter extends AbstractActionConverter {
  public assembly(data: SinglePlayerCheatResourceAction): Uint8Array {
    const byteBuffer = new DataBuffer(6, true);

    byteBuffer.writeUint8(data.type);
    byteBuffer.writeUint8(data.unknown);
    byteBuffer.writeUint32(data.count);
    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SinglePlayerCheatResourceAction {
    byteBuffer.offset--;

    return {
      type: byteBuffer.readUint8(),
      unknown: byteBuffer.readUint8(),
      count: byteBuffer.readUint32(),
    };
  }
}
