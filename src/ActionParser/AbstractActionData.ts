import { DataBuffer } from "../DataBuffer";

export interface AbstractActionData {
  type?: number;
}

export abstract class AbstractActionConverter {
  public abstract assembly(data: AbstractActionData): Uint8Array;

  public abstract parse(dataBuffer: DataBuffer): AbstractActionData;
}
