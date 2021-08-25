import parseTokens from "./parseTokens.js";

describe("Word Separators", () => {
  // prettier-ignore
  let tests = {
    "Hello World": ["hello", "world"],
    "Hello-World": ["hello", "world"],
    "Hello·World": ["hello", "world"],
    "Hello•World": ["hello", "world"],
    "Hello_World": ["hello", "world"],
    "Hello…World": ["hello", "world"],
    "Hello(World)": ["hello", "world"],
    "Hello<World>": ["hello", "world"],
    "Hello  World": ["hello", "world"],
    "Hello   World": ["hello", "world"],
    "Hello:  World": ["hello", "world"],
    "Hello---World": ["hello", "world"],
    "¡Hello World!": ["hello", "world"],
    "Hello #1 World": ["hello", "1", "world"],
    "Hello.... World": ["hello", "world"],
    "Hello #@$%! World": ["hello", "world"],
    "Hello…...^-There-^...…World": ["hello", "there", "world"],
    "A$B$C$D$E$F$G$H": ["a", "b", "c", "d", "e", "f", "g", "h"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should split at word boundaries (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Retaining 'and' Symbols", () => {
  let tests = {
    "He+llo": ["he", "+", "llo"],
    "Hello +": ["hello", "+"],
    "Hello+World": ["hello", "+", "world"],
    "Hello + World": ["hello", "+", "world"],
    "Hello&World": ["hello", "&", "world"],
    "Hello & World": ["hello", "&", "world"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should retain 'and' symbols as their own token (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

// From Movie "Titles with Unusual Symbols"
// https://www.imdb.com/list/ls098136839/

describe("Movie Titles with Unusual Symbols", () => {
  let movies = {
    "Æon Flux": ["aeon", "flux"],
    "Romeo & Juliet": ["romeo", "&", "juliet"],
    "8½": ["8"],
    "WALL·E": ["wall", "e"],
    "61*": ["61"],
    "Bigger Stronger Faster*": ["bigger", "stronger", "faster"],
    "Blood+": ["blood", "+"],
    "Tristan + Isolde": ["tristan", "+", "isolde"],
    "Patti Cake$": ["patti", "cake"],
    "*batteries not included": ["batteries", "not", "included"],
    "Bat*21": ["bat", "21"],
    "$5 a Day": ["5", "a", "day"],
    "9½ Weeks": ["9", "weeks"],
    // The following examples could be better, but are reasonable.
    // Since they're edge cases I won't sweat them too much for now.
    "M*A*S*H": ["m", "a", "s", "h"],
    "What the #$*! Do We (K)now!?": ["what", "the", "do", "we", "k", "now"],
    "Totally F***ed Up": ["totally", "f", "ed", "up"],
  };

  Object.keys(movies).forEach((title) => {
    it(`should properly parse movie titles with symbols (${title})`, () => {
      expect(parseTokens(title)).toEqual(movies[title]);
    });
  });
});
