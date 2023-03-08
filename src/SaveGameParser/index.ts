import {
  AbstractRecordsConverter,
  Compressor,
  Decompressor,
  PackedConverter,
} from "../PackedParser";
import {
  SaveGameRecordConverter,
  SaveGameRecords,
} from "./SaveGameRecordConverter";

export class SaveGameParser<
  T extends SaveGameRecords
> extends PackedConverter<T> {
  protected recordsConverter: SaveGameRecordConverter<T>;

  constructor(decompressor: Decompressor, compressor?: Compressor) {
    super(decompressor, compressor);
    this.recordsConverter = new SaveGameRecordConverter();
  }
}
