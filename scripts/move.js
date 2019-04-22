let fs = require("fs-extra");
let path = require("path");

const HOME = require("os").homedir();

let widgetFolder = path.join(
  HOME,
  "/Library/Application Support/Übersicht/widgets"
);
let binFolder = path.join(HOME, ".bin/uber-bar-api");

let widgetSourceDir = path.join(__dirname, "../packages/widget");
let apiSourceDir = path.join(__dirname, "../packages/api/build");

async function main() {
  await Promise.all([widgetFolder, binFolder].map(x => fs.ensureDir(x)));

  fs.copy(widgetSourceDir, path.join(widgetFolder, "uber-bar"));
}
main();
