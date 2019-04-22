import { css } from "uebersicht";
import { buildRulesFromAlias } from "./helpers";

export let Box = ({ css: _css = {}, ...props }) => {
  let style = { boxSizing: "border-box", ...buildRulesFromAlias(props) };

  return (
    <div
      {...props}
      className={css({
        ..._css,
        ...style
      })}
    />
  );
};

export let Flex = ({
  flexDirection,
  alignItems,
  alignSelf,
  justifyContent,
  ...props
}) => (
  <Box
    {...props}
    css={{
      ...(props.css || {}),
      display: "flex",
      flexDirection,
      alignItems,
      alignSelf,
      justifyContent
    }}
  />
);

export let Text = ({
  fontSize = 12,
  fontFamily = "IBM Plex Mono",
  fontWeight = "normal",
  color,
  css: _css = {},
  ...props
}) => {
  return (
    <Box
      {...props}
      css={{ ..._css, fontSize, fontFamily, fontWeight, color }}
    />
  );
};

export let Icon = ({ color = "", ...props }) => (
  <Box
    css={{
      color,
      width: 24,
      height: 24,
      "font-family": "Material Icons",
      "font-weight": "normal",
      "font-style": "normal",
      "font-size": 24,
      "line-height": "24px",
      "letter-spacing": "normal",
      "text-transform": "none",
      display: "inline-block",
      "white-space": "nowrap",
      "word-wrap": "normal",
      direction: "ltr",
      "-moz-font-feature-settings": "liga",
      "-moz-osx-font-smoothing": "grayscale"
    }}
    {...props}
  />
);
