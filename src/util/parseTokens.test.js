import parseTokens from "./parseTokens.js";

describe("Capitalization", () => {
  // prettier-ignore
  let tests = {
    "Hello": ["hello"],
    "HELLO": ["hello"],
    "HeLlO": ["hello"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should convert to lowercase (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Flattening Diacritics", () => {
  let tests = {
    "Ḣéļḹö Ⱳôȑĺȡ": ["hello", "world"],
    "Les Misérable": ["les", "miserable"],
    "ỆᶍǍᶆṔƚÉ áéíóúýčďěňřšťžů": ["example", "aeiouycdenrstzu"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should strip diacritics (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Special Characters", () => {
  let tests = {
    "Hello World!": ["hello", "world"],
    "Hello, World,": ["hello", "world"],
    "¡Hello World!": ["hello", "world"],
    "Hello Worlds'": ["hello", "worlds"],
    "Hello #1 World": ["hello", "1", "world"],
    "Hello #@$%! World": ["hello", "world"],
    "Hello: World II": ["hello", "world", "ii"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should strip most special characters (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Word Dividers", () => {
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
    "Hello---World": ["hello", "world"],
    "Hello.... World": ["hello", "world"],
    "Hello…...^-World": ["hello", "world"],
    "Hello…...^-There-^...…World": ["hello", "there", "world"],
    "A$B$C$D$E$F$G$H": ["a", "b", "c", "d", "e", "f", "g", "h"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should split at word boundaries (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Removing Apostrophes", () => {
  let tests = {
    "Can't": ["cant"],
    "The Smith's": ["the", "smiths"],
    "This won't work, will it?": ["this", "wont", "work", "will", "it"],
    "Hello'World'": ["helloworld"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should flatten contractions (${input})`, () => {
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
    it(`should retain 'and' symbols (${input})`, () => {
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
    it(`should properly parse movie titles with unusual symbols (${title})`, () => {
      expect(parseTokens(title)).toEqual(movies[title]);
    });
  });
});
