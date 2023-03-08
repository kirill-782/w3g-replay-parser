import { DataBuffer } from "../DataBuffer";

export interface SlotInfo {
  playerId: number;
  downloadStatus: number;
  slotStatus: number;
  computer: number;
  team: number;
  color: number;
  race: number;
  computerType: number;
  handicap: number;
}

export class SlotInfoConverter {
  public assembly(slotInfo: SlotInfo): Uint8Array {
    const bb = new DataBuffer(9);

    bb.writeUint8(slotInfo.playerId);
    bb.writeUint8(slotInfo.downloadStatus);
    bb.writeUint8(slotInfo.slotStatus);
    bb.writeUint8(slotInfo.computer);
    bb.writeUint8(slotInfo.team);
    bb.writeUint8(slotInfo.color);
    bb.writeUint8(slotInfo.race);
    bb.writeUint8(slotInfo.computerType);
    bb.writeUint8(slotInfo.handicap);
    
    return bb.buffer;
  }

  public parse(bb: DataBuffer) {
    return {
      playerId: bb.readUint8(),
      downloadStatus: bb.readUint8(),
      slotStatus: bb.readUint8(),
      computer: bb.readUint8(),
      team: bb.readUint8(),
      color: bb.readUint8(),
      race: bb.readUint8(),
      computerType: bb.readUint8(),
      handicap: bb.readUint8(),
    };
  }
}
