
// I checked this lib and decided to leave it here

const fs = require("fs");
const Zlib = require("zlib");

const ReplayParser = require("./dist/lib/index").default;
const SaveGameParser = require("./dist/lib/index").SaveGameParser;


const filePath = "public/lol_kek_4eburnet.w3z";

//const filePath = "public/LastReplay.w3g";

let asuna = new SaveGameParser();

const result = asuna.parseSaveGame(fs.readFileSync(filePath));


debugger;
