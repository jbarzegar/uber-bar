import WebSocket from "ws";
import path from "path";
import { exec as _exec } from "child_process";
import { promisify } from "util";
import sysInfo from "systeminformation";

const exec = promisify(_exec);

let wsServer = new WebSocket.Server({
  port: 2233
});

let scriptsPath = path.resolve(__dirname, "../scripts");

const MESSAGE_MAP = {
  sys: async message => {
    let info = await sysInfo[message]();

    return info;
  },
  exec: async message => {
    let shellScript = (() => {
      switch (message) {
        case "fetch-active-screen":
          return "fetch-active-screen.sh";
        case "fetch-screen-count":
          return "fetch-screen-count.sh";
        case "fetch-tiling-status":
          return "fetch-tiling-status.sh";
        case "music":
          return "music.sh";
      }
    })();

    let resp = await exec(path.join(scriptsPath, shellScript));

    return resp;
  }
};

async function handleMessage({ type, payload }) {
  if (!type) return;

  let resp = await MESSAGE_MAP[type](payload);

  return { ...resp, type, payload };
}

wsServer.on("connection", function connection(ws) {
  ws.on("message", function message(message) {
    try {
      handleMessage(JSON.parse(message)).then(response =>
        ws.send(JSON.stringify(response))
      );
    } catch (e) {} // Throw away invalid messages
  });
});

exec("osascript -e 'tell application \"Übersicht\" to refresh'")