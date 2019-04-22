import { Flex, Text, Icon } from "uberbass";
import { colors } from "./theme";

let ScreenItem = ({ active = false, ...props }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      bg={active ? colors.pink : undefined}
      mx={5}
      css={{ borderRadius: "50%", height: 28, width: 28 }}
    >
      <Text
        fontSize="14"
        fontWeight="bold"
        m="auto"
        color={active ? "#FFF" : colors.white}
        {...props}
      />
    </Flex>
  );
};

let Screens = ({ tilingMode = "", activeScreen = "", screenCount = [] }) => (
  <Flex mr={"auto"} flex={1} alignItems="center">
    <Icon color={colors.pink} mr={10} pt={1}>
      tv
    </Icon>
    <Flex alignItems="center">
      {screenCount.map(x => (
        <ScreenItem key={activeScreen + x} active={x === activeScreen}>
          {x}
        </ScreenItem>
      ))}
    </Flex>
    <Text ml={5} fontSize="14" color={colors.white} fontWeight={"bold"}>
      [{tilingMode}]
    </Text>
  </Flex>
);

export default Screens;
