// I checked this lib and decided to leave it here
const DataBuffer = require("./dist/lib/DataBuffer").DataBuffer;

if (true) {
  const fs = require("fs");
  const Zlib = require("zlib");

  const decompressor = (data) => {
    return Zlib.inflateSync(data, { finishFlush: Zlib.constants.Z_SYNC_FLUSH });
  };

  const compressor = (data) => {
    return Zlib.deflateSync(data, { finishFlush: Zlib.constants.Z_SYNC_FLUSH });
  };

  const PackedConverter = require("./dist/lib/PackedParser").PackedConverter;
  const ReplayParser = require("./dist/lib/ReplayParser/index").ReplayParser;
  const ActionParser2 = require("./dist/lib/ActionParser/index").ActionParser;

  const SaveGameParser =
    require("./dist/lib/SaveGameParser/index").SaveGameParser;

  const filePath = "public/111.w3g";

  //const filePath = "public/LastReplay.w3g";

  let asuna = new ReplayParser(decompressor, compressor);
  let sgp = new SaveGameParser(decompressor, compressor);

  const res = sgp.parse(
    DataBuffer.wrap(fs.readFileSync("public/lol_kek_4eburnet.w3z"), true)
  );

  const result = asuna.parse(DataBuffer.wrap(fs.readFileSync(filePath), true));
  const data = asuna.assembly(result);

  const result2 = asuna.parse(DataBuffer.wrap(data, true));

  const ap = new ActionParser2();

  result.records.actions.forEach((i) => {
    if (i.record.rawData.byteLength)
      ap.assembly(ap.parse(DataBuffer.wrap(i.record.rawData, true)));
  });

  const x = 0;
}
const amqplib = require("amqplib");
const ActionParser = require("./dist/lib/ActionParser").ActionParser;

const parser = new ActionParser([]);

