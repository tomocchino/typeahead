import flatten from "./flatten";

export default function parseTokens(string: string) {
  return flatten(string).split(/\s+/);
}
