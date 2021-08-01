import latinize from "latinize";

export default function parseTokens(text) {
  return latinize(text).toLocaleLowerCase().split(" ");
}
