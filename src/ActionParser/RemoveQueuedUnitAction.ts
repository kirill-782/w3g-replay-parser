import { DataBuffer } from "../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";

export interface RemoveQueuedUnitAction extends AbstractActionData {
  slot: number;
  itemId: number;
}

export class RemoveQueuedUnitConverter extends AbstractActionConverter {
  public static readonly type = 0x1e;

  public assembly(data: RemoveQueuedUnitAction): Uint8Array {
    const byteBuffer = new DataBuffer(6, true);

    byteBuffer.writeUint8(RemoveQueuedUnitConverter.type);
    byteBuffer.writeUint8(data.slot);
    byteBuffer.writeUint32(data.itemId);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): RemoveQueuedUnitAction {
    return {
      type: RemoveQueuedUnitConverter.type,
      slot: byteBuffer.readUint8(),
      itemId: byteBuffer.readUint32(),
    };
  }
}
