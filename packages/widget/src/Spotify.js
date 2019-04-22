import { Text, Flex } from "uberbass";
import { colors } from "./theme";

let SongText = props => (
  <Text mx={4} css={{ fontStyle: "italic" }} {...props} />
);

let Spotify = ({ music }) => (
  <Flex
    css={{
      position: "absolute",
      left: 0,
      right: 0,
      width: "100%"
    }}
    mx={"auto"}
    flex={1}
    alignItems="center"
    justifyContent="center"
  >
    <SongText color={colors.white}>{music}</SongText>
    {/* <SongText color={colors.green}>Such Small Hands</SongText>
    <SongText color={colors.white}>-</SongText>
    <SongText color={colors.white}>La Dispute</SongText>
    <SongText color={colors.yellow}>Paused</SongText> */}
  </Flex>
);

export default Spotify;
