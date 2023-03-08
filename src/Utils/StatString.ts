import { DataBuffer } from "../DataBuffer";
import { stringBytes } from "./index";

export interface StatStringData {
  speed: number;
  hideTerrain: boolean;
  mapExplored: boolean;
  alwaysVisible: boolean;
  default: boolean;
  observerMode: number;
  teamsTogether: boolean;
  fixedTeams: boolean;
  fullSharedUnitControl: boolean;
  randomHero: boolean;
  randomRaces: boolean;
  referees: boolean;
  mapChecksum: Uint8Array;
  mapChecksumSha1: Uint8Array;
  mapPath: string;
  creator: string;
  mapWidth: number;
  mapHeight: number;
}

export class StatString {
  public decode(data: Uint8Array): Uint8Array {
    let mask = 0;
    const result: number[] = [];

    for (let i = 0; i < data.length; ++i) {
      if (i % 8 === 0) {
        mask = data[i];
      } else {
        if ((mask & (1 << i % 8)) === 0) {
          result.push(data[i] - 1);
        } else {
          result.push(data[i]);
        }
      }
    }

    return new Uint8Array(result);
  }

  public encode(data: Uint8Array): Uint8Array {
    let mask = 1;
    const result: number[] = [];

    for (let i = 0; i < data.length; ++i) {
      if (data[i] % 2 === 0) {
        result.push(data[i] + 1);
      } else {
        result.push(data[i]);
        mask |= 1 << ((i % 7) + 1);
      }

      if (i % 7 === 6 || i === data.length - 1) {
        result.splice(result.length - (i % 7) - 1, 0, mask);
        mask = 1;
      }
    }

    return new Uint8Array(result);
  }

  public parse(data: Uint8Array): StatStringData {
    const bb = DataBuffer.wrap(data, true);
    bb.limit = data.length;

    const speed = bb.readUint8();
    const secondByte = bb.readUint8();
    const thirdByte = bb.readUint8();
    const fourthByte = bb.readUint8();
    bb.skip(1);
    const mapWidth = bb.readUint16();
    const mapHeight = bb.readUint16();
    const checksum = bb.readBytes(4).toBuffer();
    const mapName = bb.readCString();
    const creator = bb.readCString();
    bb.skip(1);
    const checksumSha1 = bb.readBytes(20).toBuffer();
    return {
      speed,
      hideTerrain: !!(secondByte & 0b00000001),
      mapExplored: !!(secondByte & 0b00000010),
      alwaysVisible: !!(secondByte & 0b00000100),
      default: !!(secondByte & 0b00001000),
      observerMode: (secondByte & 0b00110000) >>> 4,
      teamsTogether: !!(secondByte & 0b01000000),
      fixedTeams: !!(thirdByte & 0b00000110),
      fullSharedUnitControl: !!(fourthByte & 0b00000001),
      randomHero: !!(fourthByte & 0b00000010),
      randomRaces: !!(fourthByte & 0b00000100),
      referees: !!(fourthByte & 0b01000000),
      mapPath: mapName,
      creator: creator,
      mapChecksum: checksum,
      mapChecksumSha1: checksumSha1,
      mapWidth,
      mapHeight,
    };
  }

  public assembly(data: StatStringData): Uint8Array {
    const bb = new DataBuffer(
      34 + stringBytes(data.mapPath) + stringBytes(data.creator) + 2,
      true
    );
    bb.writeUint8(data.speed);

    let secondByte = 0;
    if (data.hideTerrain) secondByte |= 0b00000001;
    if (data.mapExplored) secondByte |= 0b00000010;
    if (data.alwaysVisible) secondByte |= 0b00000100;
    if (data.default) secondByte |= 0b00001000;
    secondByte |= (data.observerMode << 4) & 0b00110000;
    if (data.teamsTogether) secondByte |= 0b01000000;
    bb.writeUint8(secondByte);

    let thirdByte = 0;
    if (data.fixedTeams) thirdByte |= 0b00000110;
    bb.writeUint8(thirdByte);

    let fourthByte = 0;
    if (data.fullSharedUnitControl) fourthByte |= 0b00000001;
    if (data.randomHero) fourthByte |= 0b00000010;
    if (data.randomRaces) fourthByte |= 0b00000100;
    if (data.referees) fourthByte |= 0b01000000;
    bb.writeUint8(fourthByte);
    bb.skip(1);
    bb.writeUint16(data.mapWidth);
    bb.writeUint16(data.mapHeight);
    bb.writeBytes(data.mapChecksum);
    bb.writeCString(data.mapPath);
    bb.writeCString(data.creator);
    bb.writeUint8(0);
    bb.writeBytes(data.mapChecksumSha1);
    return bb.buffer;
  }
}
