import { css } from "uebersicht";
import { format } from "date-fns";
import throttle from "lodash/throttle";

import {
  EXEC_MESSAGES,
  SYS_MESSAGES,
  TIMEOUTS,
  SOCKET_URL
} from "./lib/constants";
import { actions, reduceState, initialState } from "./lib/state";
import { constructObjectWithDefaultValue } from "./lib/uberbass/helpers";

import Screens from "./src/Screens";
// import Spotify from "./src/Spotify";
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

let reassignStateKey = (k, v) =>
  actions.assign(state => ({ ...state, [k]: v }));

let pollers = ({ dispatch, socket }) => [
  [
    "screenCount",
    () =>
      socket.send(
        JSON.stringify({
          type: "exec",
          payload: EXEC_MESSAGES.fetchScreenCount
        })
      )
  ],
  [
    "activeScreen",
    () =>
      socket.send(
        JSON.stringify({
          type: "exec",
          payload: EXEC_MESSAGES.fetchActiveScreens
        })
      )
  ],
  [
    "tilingMode",
    () =>
      socket.send(
        JSON.stringify({
          type: "exec",
          payload: EXEC_MESSAGES.fetchTilingStatus
        })
      )
  ],
  [
    "cpu",
    () =>
      socket.send(
        JSON.stringify({ type: "sys", payload: SYS_MESSAGES.currentLoad })
      )
  ],
  [
    "battery",
    () =>
      socket.send(
        JSON.stringify({ type: "sys", payload: SYS_MESSAGES.battery })
      )
  ],
  [
    "date",
    () =>
      dispatch(
        actions.assign(state => ({
          ...state,
          date: format(Date.now(), "ddd MMM D")
        }))
      )
  ],
  [
    "time",
    () =>
      dispatch(
        actions.assign(state => ({
          ...state,
          time: format(Date.now(), "h:mm a")
        }))
      )
  ]
];

export const init = dispatch => {
  const socket = new WebSocket(SOCKET_URL);

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
          reassignStateKey("activeScreen", parseInt(data.stdout.trim()))
        );
      case EXEC_MESSAGES.fetchScreenCount:
        return dispatch(
          reassignStateKey(
            "screenCount",
            data.stdout
              .trim()
              .split(" ")
              .map(parseFloat)
          )
        );
      case EXEC_MESSAGES.fetchTilingStatus:
        return dispatch(reassignStateKey("tilingMode", data.stdout.trim()));
      case SYS_MESSAGES.battery:
        return dispatch(reassignStateKey("battery", data));
      case SYS_MESSAGES.currentLoad:
        return dispatch(reassignStateKey("cpu", data));
    }
  });

  pollers({ dispatch, socket }).forEach(args => createPoller(...args));

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
}) => (
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
  bottom: 0,
  background: "rgba(42, 52, 61, 0.7);",
  height: "40px",
  width: "100%",
  margin: "auto",
  position: "absolute"
};
