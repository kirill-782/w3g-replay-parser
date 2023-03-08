import { DataBuffer } from "../../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "../AbstractActionData";

export interface SinglePlayerCheatTimeAction extends AbstractActionData {
  type: number;
  count: number;
}

export class SinglePlayerCheatTimeConverter extends AbstractActionConverter {
  public assembly(data: SinglePlayerCheatTimeAction): Uint8Array {
    const byteBuffer = new DataBuffer(5, true);

    byteBuffer.writeUint8(data.type);
    byteBuffer.readFloat32(data.count);
    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SinglePlayerCheatTimeAction {
    byteBuffer.offset--;

    return {
      type: byteBuffer.readUint8(),
      count: byteBuffer.readFloat32(),
    };
  }
}
