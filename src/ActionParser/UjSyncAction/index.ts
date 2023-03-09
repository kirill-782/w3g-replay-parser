import { DataBuffer } from "../../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "../AbstractActionData";
import { SyncHashtableVariableConverter } from "./SyncHashtableVariable";

export interface UjSyncAction extends AbstractActionData {
  type: number;
  subAction: AbstractActionData;
}

const defaultSubActionHandlers: AbstractActionConverter[] = [];
defaultSubActionHandlers[SyncHashtableVariableConverter.type] =
  new SyncHashtableVariableConverter();

export class UjSyncConverter extends AbstractActionConverter {
  public static readonly type = 0xa0;

  public assembly(data: UjSyncAction): Uint8Array {
    const subActionHandler = defaultSubActionHandlers[data.subAction.type];

    if (!subActionHandler) {
      throw new Error("Unknown subtype " + data.subAction.type);
    }

    const subAction = subActionHandler.assembly(data.subAction);
    const byteBuffer = new DataBuffer(subAction.byteLength + 4, true);

    byteBuffer.writeUint8(UjSyncConverter.type);
    byteBuffer.writeUint8(91); // [
    byteBuffer.writeUint8(data.subAction.type);
    byteBuffer.writeUint8(93); // ]
    byteBuffer.append(subAction);


    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): UjSyncAction {
    const openTag = byteBuffer.readUint8();
    const subType = byteBuffer.readUint8();
    const closeTag = byteBuffer.readUint8();

    const subActionHandler = defaultSubActionHandlers[subType];

    if (!subActionHandler) {
      throw new Error("Unknown subtype " + subType);
    }

    return {
      type: UjSyncConverter.type,
      subAction: subActionHandler.parse(byteBuffer),
    };
  }
}
