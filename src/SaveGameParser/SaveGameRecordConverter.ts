import { DataBuffer } from "../DataBuffer";
import { AbstractRecordsConverter, RecordProcessState } from "../PackedParser";
import { SlotInfo, SlotInfoConverter } from "../Utils/SlotInfo";

export interface SaveGameRecords {
  mapPath: string;
  gameName: string;
  slots: SlotInfo[];
  randomSeed: number;
  gameMode: number;
  startSpotCount: number;
  magicNumber: number;
}

export class SaveGameRecordConverter<T extends SaveGameRecords>
  implements AbstractRecordsConverter<T>
{
  public records: T;

  private currentTime: number;

  private slotInfoConverter: SlotInfoConverter;

  constructor() {
    this.currentTime = 0;
    this.slotInfoConverter = new SlotInfoConverter();
    this.records = { ...this.records, raw: [] };
  }

  public parse(data: DataBuffer) {
    const mapPath = data.readCString();
    data.readCString(); // ???
    const gameName = data.readCString();
    data.readCString(); // ???
    data.readCString(); // stat string

    data.skip(10);

    const numSlots = data.readUint8();
    const slots = new Array<SlotInfo>();

    for (let i = 0; i < numSlots; ++i) {
      slots[i] = this.slotInfoConverter.parse(data);
    }

    const randomSeed = data.readUint32();
    const gameMode = data.readUint8();
    const startSpotCount = data.readUint8();
    const magicNumber = data.readUint32();

    this.records = {
      ...this.records,
      mapPath,
      gameName,
      slots,
      randomSeed,
      gameMode,
      startSpotCount,
      magicNumber,
    };

    return RecordProcessState.Complete;
  }

  public assembly(dataCallback: (dataPart: Uint8Array) => void) {
    throw new Error("Not implimented");
  }
}
