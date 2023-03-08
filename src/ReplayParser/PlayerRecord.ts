import { DataBuffer } from "../DataBuffer";
import { PlayerInfo, PlayerInfoConverter } from "../Utils/PlayerInfo";
import { AbstractRecord, AbstractRecordConverter } from "./AbstractRecord";

export interface PlayerRecord extends AbstractRecord, PlayerInfo {
  unknown: number;
}

export class PlayerRecordConverter extends AbstractRecordConverter {
  public static readonly type = 0x16;

  private playerInfoConverter: PlayerInfoConverter;

  constructor() {
    super();
    this.playerInfoConverter = new PlayerInfoConverter();
  }

  public checkEnough(data: DataBuffer): boolean {
    return true;
  }

  public assembly(data: PlayerRecord): Uint8Array {
    const hostPlayerBytes = this.playerInfoConverter.assembly(data);

    const bytebuffer = new DataBuffer(5 + hostPlayerBytes.byteLength, true);

    bytebuffer.writeUint8(PlayerRecordConverter.type);
    bytebuffer.append(hostPlayerBytes);
    bytebuffer.writeUint32(data.unknown);

    return bytebuffer.buffer;
  }

  public parse(dataBuffer: DataBuffer): PlayerRecord {
    return {
      type: PlayerRecordConverter.type,
      ...this.playerInfoConverter.parse(dataBuffer),
      unknown: dataBuffer.readUint32(),
    };
  }
}
