import { RULE_KEYS, RULE_MAP } from "./constants";

export let constructObjectWithDefaultValue = (keys = [], value) =>
  keys.reduce((obj, v) => {
    obj[v] = value;
    return obj;
  }, {});

export let createRule = (rule, value) => {
  if (Array.isArray(rule)) {
    return constructObjectWithDefaultValue(rule, value);
  }
  return { [rule]: value };
};

export let buildRulesFromAlias = p => {
  let keys = Object.entries(p)
    .filter(([k, v]) => RULE_KEYS.includes(k))
    .reduce((obj, [k, v]) => ({ ...obj, ...createRule(RULE_MAP[k], v) }), {});

  return keys;
};
