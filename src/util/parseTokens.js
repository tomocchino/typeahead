import flatten from "./flatten";

export default function parseTokens(string) {
  return flatten(string).split(/\s+/);
}
