export default function flattenString(string: string) {
  // Minimal mapping for characters that don't decompose with normalize()
  const specialChars: { [key: string]: string } = {
    Ⱳ: "w",
    ⱳ: "w",
    ᶍ: "x",
    ᶆ: "m",
    Ṕ: "p",
    ƚ: "l",
    Ƚ: "l",
    Ɇ: "e",
    ɇ: "e",
    Ᵽ: "p",
    Ɐ: "a",
    ǝ: "e",
    ȡ: "d",
  };

  // First replace special characters that don't decompose
  let result = string.replace(/./g, (char) => specialChars[char] || char);

  // Then normalize to NFD and remove diacritics
  result = result
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .toLowerCase();

  // Now handle special characters
  result = result.replace(/[^a-z0-9 ]/g, (char) => {
    if (char === '"' || char === "'") {
      return ""; // Remove quotes and apostrophes
    } else if (char === "&" || char === "+") {
      return ` ${char} `; // Add spaces around & and +
    } else {
      return " "; // Replace other special chars with spaces
    }
  });

  // Don't collapse multiple spaces - keep them as is
  return result.trim();
}
