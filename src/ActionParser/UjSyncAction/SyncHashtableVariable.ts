import { DataBuffer } from "../../DataBuffer";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "../AbstractActionData";

export enum VariableType {
  TYPE_NOTHING = 0, // "nothing"
  TYPE_UNKNOWN = 1, // "unknown"
  TYPE_NULL = 2, // "null"
  TYPE_CODE = 3, // "code"
  TYPE_INTEGER = 4, // "integer"
  TYPE_REAL = 5, // "real"
  TYPE_STRING = 6, // "string"
  TYPE_HANDLE = 7, // "handle"
  TYPE_BOOLEAN = 8, // "boolean"
  TYPE_INTEGER_ARRAY = 9, // "integer array"
  TYPE_REAL_ARRAY = 10, // "real array"
  TYPE_STRING_ARRAY = 11, // "string array"
  TYPE_HANDLE_ARRAY = 12, // "handle array"
  TYPE_BOOLEAN_ARRAY = 13, // "boolean array"
}

export interface SyncHashtableVariableAction extends AbstractActionData {
  handleId: number;
  parentKey: number;
  childKey: number;
  value?:
    | {
        variableType: VariableType.TYPE_INTEGER;
        integerValue: number;
      }
    | {
        variableType: VariableType.TYPE_REAL;
        realValue: number;
      }
    | {
        variableType: VariableType.TYPE_STRING;
        stringValue: string;
      }
    | {
        variableType: VariableType.TYPE_BOOLEAN;
        booleanValue: number;
      }
    | {
        variableType: VariableType.TYPE_HANDLE;
        handleId: number;
      };
  rawValue?: {
    variableType: number;
    data: Uint8Array;
  };
}

export class SyncHashtableVariableConverter extends AbstractActionConverter {
  public static readonly type = 0x0b;

  public assembly(data: SyncHashtableVariableAction): Uint8Array {
    let payloadBuffer: DataBuffer;

    const value = data.value;
    const rawValue = data.rawValue;

    if (value) {
      switch (value.variableType) {
        case VariableType.TYPE_INTEGER:
          payloadBuffer = new DataBuffer(4, true);
          payloadBuffer.writeInt32(value.integerValue);
          break;

        case VariableType.TYPE_REAL:
          payloadBuffer = new DataBuffer(4, true);
          payloadBuffer.writeFloat32(value.realValue);
          break;

        case VariableType.TYPE_STRING:
          const encoder = new TextEncoder();
          const encodedString = encoder.encode(value.stringValue);
          payloadBuffer = DataBuffer.wrap(encodedString, true);
          break;

        case VariableType.TYPE_HANDLE:
          payloadBuffer = new DataBuffer(4, true);
          payloadBuffer.writeInt32(value.handleId);
          break;

        case VariableType.TYPE_BOOLEAN:
          payloadBuffer = new DataBuffer(1, true);
          payloadBuffer.readUint8(value.booleanValue);
          break;
      }
    } else if (rawValue) {
      payloadBuffer = DataBuffer.wrap(rawValue.data);
    }

    const byteBuffer = new DataBuffer(
      payloadBuffer.buffer.byteLength + 15,
      true
    );

    byteBuffer.writeUint8(
      data.value?.variableType || data.rawValue?.variableType || 0
    );

    byteBuffer.writeUint16(payloadBuffer.buffer.byteLength);
    byteBuffer.writeUint32(data.handleId);
    byteBuffer.writeUint32(data.parentKey);
    byteBuffer.writeUint32(data.childKey);
    byteBuffer.writeBytes(payloadBuffer.buffer);

    return byteBuffer.buffer;
  }

  public parse(byteBuffer: DataBuffer): SyncHashtableVariableAction {
    const variableType = byteBuffer.readUint8();
    const payloadLength = byteBuffer.readUint16();
    const handleId = byteBuffer.readUint32();
    const parentKey = byteBuffer.readInt32();
    const childKey = byteBuffer.readInt32();

    let value;
    let rawValue;

    switch (variableType) {
      case VariableType.TYPE_INTEGER:
        value = {
          variableType,
          integerValue: byteBuffer.readInt32(),
        };

        break;

      case VariableType.TYPE_REAL:
        value = {
          variableType,
          realValue: byteBuffer.readFloat32(),
        };

        break;

      case VariableType.TYPE_STRING:
        value = {
          variableType,
          stringValue: new TextDecoder().decode(
            byteBuffer.readBytes(payloadLength).toBuffer()
          ),
        };

        break;

      case VariableType.TYPE_HANDLE:
        value = {
          variableType,
          handleId: byteBuffer.readUint32(),
        };

        break;

      case VariableType.TYPE_BOOLEAN:
        value = {
          variableType,
          booleanValue: byteBuffer.readUint8(),
        };

        break;

      default:
        rawValue = {
          variableType,
          data: byteBuffer.readBytes(payloadLength).toBuffer(),
        };
    }

    return {
      type: SyncHashtableVariableConverter.type,
      handleId,
      parentKey,
      childKey,
      value,
      rawValue,
    };
  }
}
