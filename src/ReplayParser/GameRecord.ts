import { DataBuffer } from "../DataBuffer";
import { stringBytes } from "../Utils";
import { PlayerInfo, PlayerInfoConverter } from "../Utils/PlayerInfo";
import { StatString, StatStringData } from "../Utils/StatString";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface GameRecord extends AbstractRecord {
  hostPlayer: PlayerInfo;
  gameName: string;
  statStringRaw: Uint8Array;
  statString: StatStringData;
  playersCount: number;
  gameType: number;
  languageId: number;
}

export class GameRecordConverter extends AbstractRecordConverter {
  public static readonly type = 0x00;

  private statStringConverter: StatString;
  private playerInfoConverter: PlayerInfoConverter;

  constructor() {
    super();
    this.statStringConverter = new StatString();
    this.playerInfoConverter = new PlayerInfoConverter();
  }

  public assembly(data: GameRecord): Uint8Array {
    const hostPlayerBytes = this.playerInfoConverter.assembly(data.hostPlayer);
    const statStringRawBytes = this.statStringConverter.encode(
      this.statStringConverter.assembly(data.statString)
    );

    const result = new DataBuffer(
      14 +
        hostPlayerBytes.byteLength +
        statStringRawBytes.byteLength +
        1 +
        stringBytes(data.gameName) +
        1,
      true
    );

    result.writeUint8(GameRecordConverter.type); // записываем тип записи
    result.writeBytes(hostPlayerBytes); // записываем данные hostPlayer

    result.writeCString(data.gameName); // записываем данные gameName
    result.writeUint8(0);

    result.writeBytes(statStringRawBytes); // записываем данные statStringRaw
    result.writeUint8(0);

    result.writeUint32(data.playersCount); // записываем данные playersCount
    result.writeUint32(data.gameType); // записываем данные gameType
    result.writeUint32(data.languageId); // записываем данные languageId

    return result.buffer;
  }

  public checkEnough(data: DataBuffer): boolean {
    return true;
  }

  public parse(dataBuffer: DataBuffer): GameRecord {
    const hostPlayer = this.playerInfoConverter.parse(dataBuffer);
    const gameName = dataBuffer.readCString();
    dataBuffer.readUint8();

    const statStringRaw = dataBuffer.readCStringAsArray().toBuffer();

    const playersCount = dataBuffer.readUint32();
    const gameType = dataBuffer.readUint32();
    const languageId = dataBuffer.readUint32();

    return {
      type: 0x0,
      hostPlayer,
      gameName,
      statStringRaw,
      playersCount,
      gameType,
      languageId,
      statString: this.statStringConverter.parse(
        this.statStringConverter.decode(statStringRaw)
      ),
    };
  }
}
