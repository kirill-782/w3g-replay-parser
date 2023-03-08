import { DataBuffer } from "../DataBuffer";
import { AbstractRecordsConverter, RecordProcessState } from "../PackedParser";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";
import { ChatRecord, ChatRecordConverter } from "./ChatRecord";
import { ChecksumRecordConverter } from "./ChecksumRecord";
import { GameRecord, GameRecordConverter } from "./GameRecord";
import { LeaveRecord, LeaveRecordConverter } from "./LeaveRecord";
import { PlayerRecord, PlayerRecordConverter } from "./PlayerRecord";
import { ReforgedRecordConverter } from "./ReforgedRecord";
import { StartRecord, StartRecordConverter } from "./StartRecord";
import { TimeSlotConverter, TimeSlotRecord } from "./TimeSlotRecord";
import { UnknownRecordConverter } from "./UnknownRecord";

export type TimedRecord<T> = {
  time: number;
  record: T;
};

export interface ReplayRecords {
  raw: AbstractRecord[];

  gameInfo?: GameRecord;
  startInfo?: StartRecord;
  players?: PlayerRecord[];
  playerLeave?: TimedRecord<LeaveRecord>[];
  chatMessages?: TimedRecord<ChatRecord>[];
  actions?: TimedRecord<TimeSlotRecord>[];
  others?: AbstractRecord[];
}

const RecordHandlers: AbstractRecordConverter[] = [];
RecordHandlers[GameRecordConverter.type] = new GameRecordConverter();
RecordHandlers[PlayerRecordConverter.type] = new PlayerRecordConverter();
RecordHandlers[StartRecordConverter.type] = new StartRecordConverter();
RecordHandlers[0x1a] = new UnknownRecordConverter();
RecordHandlers[0x1b] = new UnknownRecordConverter();
RecordHandlers[0x1c] = new UnknownRecordConverter();
RecordHandlers[ChatRecordConverter.type] = new ChatRecordConverter();
RecordHandlers[LeaveRecordConverter.type] = new LeaveRecordConverter();
RecordHandlers[0x1f] = new TimeSlotConverter();
RecordHandlers[0x1e] = new TimeSlotConverter();
RecordHandlers[GameRecordConverter.type] = new GameRecordConverter();
RecordHandlers[ChecksumRecordConverter.type] = new ChecksumRecordConverter();
RecordHandlers[ReforgedRecordConverter.type] = new ReforgedRecordConverter();

export class ReplayRecordConverter<T extends ReplayRecords>
  implements AbstractRecordsConverter<T>
{
  public records: T;

  private currentTime: number;

  constructor() {
    this.currentTime = 0;
    this.records = { ...this.records, raw: [] };
  }

  public parse(data: DataBuffer) {
    let markedOffset = data.offset;

    try {
      while (data.remaining()) {
        const type = data.readUint8();

        if (type === 0 && this.records.raw.length > 0)
          return RecordProcessState.Complete;

        const recordHandler = RecordHandlers[type];

        if (recordHandler) {
          if (recordHandler.checkEnough(data)) {
            const result = recordHandler.parse(data);
            this.processRecord(result);
          } else {
            return RecordProcessState.NeedMore;
          }
        } else {
          throw new Error("Unknown record " + type);
        }

        markedOffset = data.offset;
      }
    } catch (e) {
      if (e instanceof RangeError) {
        markedOffset = undefined;
        return RecordProcessState.NeedMore;
      } else {
        markedOffset = undefined;
        throw e;
      }
    } finally {
      if (markedOffset) {
        data.offset = markedOffset;
      }
    }

    return RecordProcessState.Success;
  }

  public assembly(dataCallback: (dataPart: Uint8Array) => void) {
    this.records.raw.forEach((i) => {
      const recordHandler = RecordHandlers[i.type];

      if (recordHandler) {
        dataCallback(recordHandler.assembly(i));
      } else {
        throw new Error("Unknown record " + i.type);
      }
    });
  }

  private processRecord(record: AbstractRecord) {
    this.records.raw.push(record);

    switch (record.type) {
      case GameRecordConverter.type:
        this.records.gameInfo = record as GameRecord;
        break;
      case PlayerRecordConverter.type:
        if (!this.records.players) {
          this.records.players = [];
        }

        this.records.players.push(record as PlayerRecord);
        break;

      case StartRecordConverter.type:
        this.records.startInfo = record as StartRecord;
        break;

      case ChatRecordConverter.type:
        if (!this.records.chatMessages) {
          this.records.chatMessages = [];
        }

        this.records.chatMessages.push({
          time: this.currentTime,
          record: record as ChatRecord,
        });

        break;

      case LeaveRecordConverter.type:
        if (!this.records.playerLeave) {
          this.records.playerLeave = [];
        }

        this.records.playerLeave.push({
          time: this.currentTime,
          record: record as LeaveRecord,
        });

        break;

      case 0x1f:
      case 0x1e:
        if (!this.records.actions) {
          this.records.actions = [];
        }

        this.currentTime += (record as TimeSlotRecord).timeIncrement;

        this.records.actions.push({
          time: this.currentTime,
          record: record as TimeSlotRecord,
        });

        break;
    }
  }
}
