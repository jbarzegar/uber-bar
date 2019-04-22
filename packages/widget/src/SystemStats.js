import { Icon, Flex, Text } from "uberbass";
import { colors } from "./theme";

let StatusItem = ({ color, iconName, status }) => (
  <Flex mx={8} alignItems="center">
    <Icon mr={4} color={color}>
      {iconName}
    </Icon>
    <Text fontSize="14" color="white">
      {status}
    </Text>
  </Flex>
);

let Battery = ({ ischarging = false, percent: _percent }) => {
  let percent = Math.round(_percent);
  let renderBatteryProps = () => {
    if (percent > 50) {
      return {
        color: colors.green
      };
    } else if (percent < 30) {
      return {
        color: colors.red,
        iconName: !ischarging ? "battery_alert" : "battery_charging_full"
      };
    } else if (percent < 50) {
      return {
        color: colors.yellow
      };
    }
  };

  return (
    <StatusItem
      iconName={ischarging ? "battery_charging_full" : "battery_full"}
      status={percent ? `${percent}%` : "--"}
      {...renderBatteryProps()}
    />
  );
};

let CPU = ({ currentload }) => {
  let currentLoad = Math.round(currentload);
  let renderColor = () => {
    if (currentLoad < 50) {
      return colors.blue;
    } else if (currentLoad >= 50) {
      return colors.yellow;
    } else if (currentLoad >= 70) {
      return colors.red;
    }
  };
  return (
    <StatusItem
      iconName="memory"
      color={renderColor()}
      status={currentLoad ? `${currentLoad}%` : "--"}
    />
  );
};

let Date = props => (
  <StatusItem color={colors.red} iconName="event" {...props} />
);

let Clock = props => (
  <StatusItem color={colors.red} iconName="access_time" {...props} />
);

let SystemStats = ({ time, date, cpu, battery }) => {
  return (
    <Flex alignItems="center">
      <Battery {...battery} />
      <CPU {...cpu} />
      <Date status={date} />
      <Clock status={time} />
    </Flex>
  );
};

export default SystemStats;
