import { clean } from "diacritic";

export default function parseTokens(text) {
  return clean(text).toLocaleLowerCase().split(" ");
}
