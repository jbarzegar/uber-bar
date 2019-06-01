let logger = require("consola");
let fs = require("fs-extra");
let { promisify } = require("util");
let exec = promisify(require("child_process").exec);
let { spawn } = require("child_process");
let fkill = require("fkill");

let { argv } = require("yargs")
  .command("no-install", "run move without installing deps")
  .alias("n", "no-install");

let { paths, shouldUseYarn } = require("./utils");

const ubersicht = "Übersicht";

let clean = () =>
  new Promise((resolve, reject) => {
    if (fs.existsSync(paths.uberBarPath)) {
      fs.emptyDir(paths.uberBarPath)
        .then(resolve)
        .catch(reject);
    } else {
      resolve();
    }
  });

let restartUbersicht = () =>
  new Promise(async (resolve, reject) => {
    logger.info(`Gracefully restarting ${ubersicht}...`);
    await fkill(ubersicht);
    setTimeout(
      () =>
        exec(`open -a ${ubersicht}`)
          .then(() => {
            logger.success(`Restarted ${ubersicht}`);
            resolve();
          })
          .catch(reject),
      3000
    );
  });

let cd = p => {
  let before = process.cwd();
  process.chdir(p);
  return () => process.chdir(before);
};

let installUberbassDeps = async () => {
  let binary = shouldUseYarn() ? "yarnpkg" : "npm";
  let goBack = cd(paths.uberBarPath);
  try {
    logger.info("Installing widget dependencies");
    return await new Promise((resolve, reject) => {
      let installer = spawn(binary, ["install"], {
        shell: true,
        stdio: "inherit"
      });

      installer.on("error", reject);

      installer.on("close", signal => {
        goBack();
        logger.success(`${binary} install completed`);
        resolve();
      });
    });
  } catch (e) {
    throw e;
  }
};

(async () => {
  try {
    await Promise.all(
      [paths.widgetFolder, paths.binFolder].map(x => fs.ensureDir(x))
    );

    await clean();

    await fs.copy(paths.widgetSourceDir, paths.uberBarPath);
    await fs.copy(paths.uberbassSourceDir, paths.uberBass);

    if (argv["no-install"] !== true) {
      await installUberbassDeps();
    }

    await restartUbersicht();
    logger.success("Widget install successful");

    if (!process.env.npm_execpath.includes("yarn.js")) {
      process.stdout.write(Buffer.from(`✨  Done`));
    }
  } catch (e) {
    throw new Error(e);
  }
})().catch(err => {
  throw new Error(err);
});
