import latinize from "latinize";

export default function parseTokens(text) {
  return latinize(text)
    .toLocaleLowerCase()
    .replace(/^[\W_]+|[\W_]+$/g, "") // remove leading and trailing special characters
    .split(/[\W_]+/); // split on non-letter characters
}
