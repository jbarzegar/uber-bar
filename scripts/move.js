let fs = require("fs-extra");
let { exec } = require("child_process");
let path = require("path");
let fkill = require("fkill");

const ubersicht = "Übersicht";
const HOME = require("os").homedir();

let widgetFolder = path.join(
  HOME,
  "/Library/Application Support/Übersicht/widgets"
);
let binFolder = path.join(HOME, ".bin/uber-bar-api");

let widgetSourceDir = path.join(__dirname, "../packages/widget");
let uberbassSourceDir = path.join(__dirname, "../packages/uberbass");

let clean = () =>
  new Promise((resolve, reject) => {
    if (fs.existsSync(path.join(widgetFolder, "uber-bar"))) {
      fs.emptyDir(path.join(widgetFolder, "uber-bar"))
        .then(resolve)
        .catch(reject);
    } else {
      resolve();
    }
  });

(async () => {
  await Promise.all([widgetFolder, binFolder].map(x => fs.ensureDir(x)));

  try {
    await clean();

    await fs.copy(widgetSourceDir, path.join(widgetFolder, "uber-bar"));
    await fs.copy(
      uberbassSourceDir,
      path.join(widgetFolder, "uber-bar", "lib", "uberbass")
    );

    console.log("gracefully restarting", ubersicht, "...");
    await fkill(ubersicht);
    setTimeout(
      () =>
        exec(`open -a ${ubersicht}`, err => {
          if (err) throw err;

          console.log("done");
        }),
      3000
    );
  } catch (e) {
    throw new Error(e);
  }
})();
