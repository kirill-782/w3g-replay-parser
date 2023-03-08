import { DataBuffer } from "../DataBuffer";
import { stringBytes } from "../Utils";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface SaveGameData extends AbstractActionData {
  fileName: string;
}

export class SaveGameConverter extends AbstractActionConverter {
  public static readonly type = 0x02;

  public assembly(data: SaveGameData): Uint8Array {
    const byteBuffer = new DataBuffer(1 + stringBytes(data.fileName) + 1, true);

    byteBuffer.writeUint8(SaveGameConverter.type);
    byteBuffer.writeCString(data.fileName);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SaveGameData {
    return {
      type: SaveGameConverter.type,
      fileName: byteBuffer.readCString(),
    };
  }
}
