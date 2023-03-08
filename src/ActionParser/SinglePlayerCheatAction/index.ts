import { DataBuffer } from "../../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "../AbstractActionData";

export interface SinglePlayerCheatAction extends AbstractActionData {
  type: number;
}

export class SinglePlayerCheatConverter extends AbstractActionConverter {
  public assembly(data: SinglePlayerCheatAction): Uint8Array {
    const byteBuffer = new DataBuffer(1, true);

    byteBuffer.writeUint8(data.type);
    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SinglePlayerCheatAction {
    byteBuffer.offset--;

    return {
      type: byteBuffer.readUint8(),
    };
  }
}
