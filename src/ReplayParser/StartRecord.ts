import { DataBuffer } from "../DataBuffer";
import { SlotInfo, SlotInfoConverter } from "../Utils/SlotInfo";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface StartRecord extends AbstractRecord {
  slots: SlotInfo[];
  randomSeed: number;
  gameMode: number;
  startSpotCount: number;
}

export class StartRecordConverter extends AbstractRecordConverter {
  public static readonly type = 0x19;

  public slotsConverter: SlotInfoConverter;

  constructor() {
    super();
    this.slotsConverter = new SlotInfoConverter();
  }

  public checkEnough(data: DataBuffer): boolean {
    const countBytes = data.readUint16(data.offset);

    return data.offset + countBytes <= data.limit;
  }

  public assembly(data: StartRecord): Uint8Array {
    const slotBytes = new Array<Uint8Array>();

    data.slots.forEach((i) => {
      slotBytes.push(this.slotsConverter.assembly(i));
    });

    const slotSize = slotBytes.reduce((val, i) => val + i.byteLength, 0);
    const dataSize = 9 + slotSize;

    const bytebuffer = new DataBuffer(dataSize, true);
    bytebuffer.writeUint16(dataSize);
    bytebuffer.writeUint8(slotBytes.length);

    slotBytes.forEach((i) => {
      bytebuffer.append(i);
    });

    bytebuffer.writeUint32(data.randomSeed);
    bytebuffer.writeUint8(data.gameMode);
    bytebuffer.writeUint8(data.startSpotCount);

    return bytebuffer.buffer;
  }

  public parse(dataBuffer: DataBuffer): StartRecord {
    const countBytes = dataBuffer.readUint16();

    const slotCount = dataBuffer.readUint8();
    const slots = [];

    for (let i = 0; i < slotCount; ++i) {
      slots.push(this.slotsConverter.parse(dataBuffer));
    }

    return {
      type: StartRecordConverter.type,
      slots,
      randomSeed: dataBuffer.readUint32(),
      gameMode: dataBuffer.readUint8(),
      startSpotCount: dataBuffer.readUint8(),
    };
  }
}
