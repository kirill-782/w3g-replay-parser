import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface SaveGameFinishedAction extends AbstractActionData {
  unknown: number;
}

export class SaveGameFinishedConverter extends AbstractActionConverter {
  public static readonly type = 0x07;

  public assembly(data: SaveGameFinishedAction): Uint8Array {
    const byteBuffer = new DataBuffer(6, true);

    byteBuffer.writeUint8(SaveGameFinishedConverter.type);
    byteBuffer.writeUint32(data.unknown);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SaveGameFinishedAction {
    return {
      type: SaveGameFinishedConverter.type,
      unknown: byteBuffer.readUint32(),
    };
  }
}
