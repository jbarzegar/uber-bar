let path = require("path");
let exec = require("child_process").execSync;

const HOME = require("os").homedir();

let root = path.join(__dirname, "../");

let widgetFolder = path.join(
  HOME,
  "/Library/Application Support/Übersicht/widgets"
);
let binFolder = path.join(HOME, ".bin/uber-bar-api");
let widgetSourceDir = path.join(root, "packages/widget");
let uberbassSourceDir = path.join(root, "packages/uberbass");
let uberBarPath = path.join(widgetFolder, "uber-bar");
let uberBass = path.join(uberBarPath, "lib", "uberbass");

function shouldUseYarn() {
  try {
    exec("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  shouldUseYarn,
  paths: {
    root,
    widgetFolder,
    binFolder,
    widgetSourceDir,
    uberbassSourceDir,
    uberBarPath,
    uberBass
  }
};
