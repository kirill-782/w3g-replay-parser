import { DataBuffer } from "../DataBuffer";
import { stringBytes } from "../Utils";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface ChatRecord extends AbstractRecord {
  playerId: number;
  flags: number;
  chatMode?: number;
  message: string;
}

export class ChatRecordConverter extends AbstractRecordConverter {
  public static readonly type = 0x20;

  public assembly(data: ChatRecord): Uint8Array {
    const bytebuffer = new DataBuffer(
      5 + (data.chatMode !== undefined && 4) + stringBytes(data.message) + 1,
      true
    );

    bytebuffer.writeUint8(ChatRecordConverter.type);
    bytebuffer.writeUint8(data.playerId);
    bytebuffer.writeUint16(0); // Блядь, chat gpt победил
    bytebuffer.writeUint8(data.flags);
    if (data.chatMode !== undefined) {
      bytebuffer.writeUint32(data.chatMode);
    }
    bytebuffer.writeCString(data.message);

    const length = bytebuffer.offset - 3;
    bytebuffer.offset = 1;
    bytebuffer.writeUint16(length);

    return bytebuffer.buffer;
  }

  public checkEnough(data: DataBuffer): boolean {
    return !(
      data.offset + 3 > data.limit ||
      data.offset + data.readUint16(data.offset + 1) + 3 > data.limit
    );
  }

  public parse(dataBuffer: DataBuffer): ChatRecord | undefined {
    const playerId = dataBuffer.readUint8();
    dataBuffer.readUint16();
    const flags = dataBuffer.readUint8();
    const chatMode = flags !== 0x10 ? dataBuffer.readUint32() : undefined;
    const message = dataBuffer.readCString();

    return {
      type: ChatRecordConverter.type,
      playerId,
      flags,
      chatMode,
      message,
    };
  }
}
