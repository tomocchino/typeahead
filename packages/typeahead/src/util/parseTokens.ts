import flatten from "./flatten";

export default function parseTokens(string: string) {
  return (
    flatten(string).match(
      /[\p{L}\p{Nd}][\p{L}\p{Nd}\p{M}\u200c\u200d]*|[&+]/gu
    ) ?? []
  );
}
