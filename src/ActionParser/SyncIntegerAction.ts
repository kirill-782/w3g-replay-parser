import { DataBuffer } from "../DataBuffer";
import { stringBytes } from "../Utils";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface SyncIntegerAction extends AbstractActionData {
  filename: string;
  missionKey: string;
  key: string;
  value: number;
}

export class SyncIntegerConverter extends AbstractActionConverter {
  public static readonly type = 0x6b;

  public assembly(data: SyncIntegerAction): Uint8Array {
    const byteBuffer = new DataBuffer(
      5 +
        stringBytes(data.filename) +
        1 +
        stringBytes(data.missionKey) +
        1 +
        stringBytes(data.key) +
        1,
      true
    );

    byteBuffer.writeUint8(SyncIntegerConverter.type);
    byteBuffer.writeCString(data.filename);
    byteBuffer.writeCString(data.missionKey);
    byteBuffer.writeCString(data.key);
    byteBuffer.writeUint32(data.value);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SyncIntegerAction {
    const filename = byteBuffer.readCString();
    const missionKey = byteBuffer.readCString();
    const key = byteBuffer.readCString();
    const value = byteBuffer.readUint32();

    return {
      type: SyncIntegerConverter.type,
      filename,
      missionKey,
      key,
      value,
    };
  }
}
