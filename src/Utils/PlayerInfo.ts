import { stringBytes } from ".";
import { DataBuffer } from "../DataBuffer";

export interface PlayerInfo {
  playerId: number;
  playerName: string;
  runtimeOfPlayers?: number;
  race?: number;
  skippedBytes?: Uint8Array;
}

export class PlayerInfoConverter {
  public assembly(data: PlayerInfo): Uint8Array {
    const additionalSize =
      (data.runtimeOfPlayers !== undefined && 1) +
      (data.race !== undefined && 1) +
      (data.skippedBytes && data.skippedBytes.byteLength);

    const bb = new DataBuffer(
      2 + stringBytes(data.playerName) + 1 + additionalSize
    );

    bb.writeUint8(data.playerId);
    bb.writeCString(data.playerName);
    bb.writeUint8(additionalSize);

    if (data.runtimeOfPlayers !== undefined)
      bb.writeUint8(data.runtimeOfPlayers);

    if (data.race !== undefined) bb.writeUint8(data.race);

    if (data.skippedBytes) bb.append(data.skippedBytes);

    return bb.buffer;
  }

  public parse(bb: DataBuffer) {
    const playerRecord: PlayerInfo = {
      playerId: bb.readUint8(),
      playerName: bb.readCString(),
    };

    const additionalSize = bb.readUint8();

    switch (additionalSize) {
      case 8:
        playerRecord.runtimeOfPlayers = bb.readUint8();
        playerRecord.race = bb.readUint8();
        playerRecord.skippedBytes = bb.readBytes(6).toBuffer();
        break;
      default:
        playerRecord.skippedBytes = bb.readBytes(additionalSize).toBuffer();
    }

    return playerRecord;
  }
}
