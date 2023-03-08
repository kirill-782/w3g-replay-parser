import {
  AbstractRecordsConverter,
  Compressor,
  Decompressor,
  PackedConverter,
} from "../PackedParser";
import { ReplayRecordConverter, ReplayRecords } from "./ReplayRecordConverter";

export class ReplayParser<T extends ReplayRecords> extends PackedConverter<T> {
  protected recordsConverter: ReplayRecordConverter<T>;

  constructor(decompressor: Decompressor, compressor?: Compressor) {
    super(decompressor, compressor);
    this.recordsConverter = new ReplayRecordConverter();
  }
}
