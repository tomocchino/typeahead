const specialChars = new Map([
  ["æ", "ae"],
  ["œ", "oe"],
  ["ß", "ss"],
  ["ø", "o"],
  ["ł", "l"],
  ["đ", "d"],
  ["ð", "d"],
  ["þ", "th"],
  ["ħ", "h"],
  ["ı", "i"],
  ["ŋ", "n"],
  ["ƒ", "f"],
  ["ⱳ", "w"],
  ["ᶍ", "x"],
  ["ᶆ", "m"],
  ["ƚ", "l"],
  ["ɇ", "e"],
  ["ᵽ", "p"],
  ["ɐ", "a"],
  ["ǝ", "e"],
  ["ȡ", "d"],
]);

export default function flattenString(string: string) {
  return string
    .normalize("NFC")
    .toLowerCase()
    .replace(/(?:\p{Script=Latin}\p{M}*)+/gu, (value) =>
      Array.from(
        value.normalize("NFKD").toLowerCase().replace(/\p{M}/gu, ""),
        (character) => specialChars.get(character) ?? character
      ).join("")
    )
    .normalize("NFC")
    .replace(/[^\p{L}\p{Nd}\p{M} \u200c\u200d]/gu, (character) => {
      if ("\"'’‘".includes(character)) {
        return "";
      }
      if (character === "&" || character === "+") {
        return ` ${character} `;
      }
      return " ";
    })
    .trim();
}
