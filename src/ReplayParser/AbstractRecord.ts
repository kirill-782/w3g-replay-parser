import { DataBuffer } from "../DataBuffer";

export interface AbstractRecord {
  type?: number;
}

export abstract class AbstractRecordConverter {
  public abstract assembly(data: AbstractRecord): Uint8Array;

  public abstract checkEnough(data: DataBuffer): boolean;

  public abstract parse(dataBuffer: DataBuffer): AbstractRecord;
}
