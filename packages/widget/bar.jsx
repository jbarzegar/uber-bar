import { css } from "uebersicht";
import { format } from "date-fns";
import throttle from "lodash/throttle";

import { EXEC_MESSAGES, SYS_MESSAGES, TIMEOUTS } from "./lib/constants";
import { actions, reduceState, initialState } from "./lib/state";
import { constructObjectWithDefaultValue } from "./lib/uberbass/helpers";

import Screens from "./src/Screens";
import Spotify from "./src/Spotify";
import SystemStats from "./src/SystemStats";

export { initialState };
export const updateState = reduceState;

const TIMERS = {};

let createPoller = (name, fn) => {
  TIMERS[name] = setInterval(throttle(fn, TIMEOUTS[name]), 100);
};

let clearTimer = name => {
  clearInterval(TIMERS[name]);
  TIMERS[name] = null;
};

export const init = dispatch => {
  const socket = new WebSocket("ws://localhost:2233");

  socket.addEventListener("open", () => {
    // Exec loop
    Object.values(EXEC_MESSAGES).forEach(msg =>
      socket.send(JSON.stringify({ type: "exec", payload: msg }))
    );

    // Sys loop
    Object.values(SYS_MESSAGES).forEach(msg =>
      socket.send(JSON.stringify({ type: "sys", payload: msg }))
    );
  });
  socket.addEventListener("message", event => {
    let { payload, ...data } = JSON.parse(event.data);

    switch (payload) {
      case EXEC_MESSAGES.fetchActiveScreens:
        return dispatch(
          actions.assign(state => ({
            ...state,
            activeScreen: parseInt(data.stdout.trim())
          }))
        );
      case EXEC_MESSAGES.fetchScreenCount:
        return dispatch(
          actions.assign(state => ({
            ...state,
            screenCount: data.stdout
              .trim()
              .split(" ")
              .map(parseFloat)
          }))
        );
      case EXEC_MESSAGES.fetchTilingStatus:
        return dispatch(
          actions.assign(state => ({
            ...state,
            tilingMode: data.stdout.trim()
          }))
        );
      case SYS_MESSAGES.battery:
        return dispatch(
          actions.assign(state => ({
            ...state,
            battery: data
          }))
        );
      case SYS_MESSAGES.currentLoad:
        return dispatch(
          actions.assign(state => ({
            ...state,
            cpu: data
          }))
        );
    }
  });

  createPoller("screenCount", () =>
    socket.send(
      JSON.stringify({ type: "exec", payload: EXEC_MESSAGES.fetchScreenCount })
    )
  );

  createPoller("activeScreen", () =>
    socket.send(
      JSON.stringify({
        type: "exec",
        payload: EXEC_MESSAGES.fetchActiveScreens
      })
    )
  );

  createPoller("tilingMode", () =>
    socket.send(
      JSON.stringify({ type: "exec", payload: EXEC_MESSAGES.fetchTilingStatus })
    )
  );

  createPoller("cpu", () =>
    socket.send(
      JSON.stringify({ type: "sys", payload: SYS_MESSAGES.currentLoad })
    )
  );
  createPoller("battery", () =>
    socket.send(JSON.stringify({ type: "sys", payload: SYS_MESSAGES.battery }))
  );

  createPoller("date", () =>
    dispatch(
      actions.assign(state => ({
        ...state,
        date: format(Date.now(), "ddd MMM D")
      }))
    )
  );

  createPoller("time", () =>
    dispatch(
      actions.assign(state => ({
        ...state,
        time: format(Date.now(), "h:mm a")
      }))
    )
  );

  window.socket = socket;
};

export const render = ({
  tilingMode,
  screenCount,
  activeScreen,
  time,
  date,
  battery,
  cpu,
  music
}) =>
  console.log("re render") || (
    <div
      className={css`
        box-sizing: border-box;
        padding-left: 30px;
        padding-right: 30px;
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
      `}
    >
      <Screens
        tilingMode={tilingMode}
        screenCount={screenCount}
        activeScreen={activeScreen}
      />
      {/* <Spotify music={music} /> */}
      <SystemStats battery={battery} cpu={cpu} time={time} date={date} />
    </div>
  );

export const className = {
  ...constructObjectWithDefaultValue(["left", "right"], 0),
  top: 8,
  background: "rgba(42, 52, 61, 0.7);",
  height: "40px",
  borderRadius: 60,
  width: "98%",
  margin: "auto",
  position: "relative"
};
