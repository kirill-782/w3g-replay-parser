import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionConverter,
  AbstractActionData,
} from "./AbstractActionData";

export interface MinimapPingAction extends AbstractActionData {
  x: number;
  y: number;
  unknown: number;
}

export class MinimapPingConverter extends AbstractActionConverter {
  public static readonly type = 0x68;

  public assembly(data: MinimapPingAction): Uint8Array {
    const byteBuffer = new DataBuffer(13, true);

    byteBuffer.writeUint8(MinimapPingConverter.type);
    byteBuffer.writeUint32(data.x);
    byteBuffer.writeUint32(data.y);
    byteBuffer.writeUint32(data.unknown);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): MinimapPingAction {
    return {
      type: MinimapPingConverter.type,
      x: byteBuffer.readUint32(),
      y: byteBuffer.readUint32(),
      unknown: byteBuffer.readUint32(),
    };
  }
}
