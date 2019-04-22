import format from "date-fns/format";

let currentDate = Date.now();
export let initialState = {
  screenCount: [],
  activeScreen: "",
  tilingMode: "bsp",
  time: format(currentDate, "h:mm a"),
  date: format(currentDate, "ddd MMM D"),
  cpu: {},
  battery: {},
  music: ""
};

export let actions = {
  setState: payload => ({ type: "SET_STATE", payload }),
  assign: payload => ({ type: "ASSIGN", payload })
};

export let reduceState = (action, state) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    case "ASSIGN":
      return action.payload(state);
    case "GET_STATE":
      console.log(state);
      return state;
    default:
      return state;
  }
};
