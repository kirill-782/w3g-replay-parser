import { DataBuffer } from "../DataBuffer";
import { stringBytes } from "../Utils";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface ChatCommandAction extends AbstractActionData {
  unknownA: number;
  unknownB: number;
  command: string;
}

export class ChatCommandConverter extends AbstractActionConverter {
  public static readonly type = 0x60;

  public assembly(data: ChatCommandAction): Uint8Array {
    const byteBuffer = new DataBuffer(9 + stringBytes(data.command) + 1, true);

    byteBuffer.writeUint8(ChatCommandConverter.type);
    byteBuffer.writeUint32(data.unknownA);
    byteBuffer.writeUint32(data.unknownB);
    byteBuffer.writeCString(data.command);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): ChatCommandAction {
    return {
      type: ChatCommandConverter.type,
      unknownA: byteBuffer.readUint32(),
      unknownB: byteBuffer.readUint32(),
      command: byteBuffer.readCString(),
    };
  }
}
