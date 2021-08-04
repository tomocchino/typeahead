import parseTokens from "./parseTokens.js";

describe("Grab Bag of Behavioral Tests", () => {
  // prettier-ignore
  let tests = {
    "Hello+": ["hello", "+"],
    "$Hello": ["hello"],
    "Hello!": ["hello"],
    "Hello +": ["hello", "+"],
    "He+llo": ["he", "+", "llo"],
    "Hello+World": ["hello", "+", "world"],
    "Hello&World": ["hello", "&", "world"],
    "Hello<World>": ["hello", "world"],
    "Hello(World)": ["hello", "world"],
    "Hello'World'": ["helloworld"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should properly parseTokens (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

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

describe("Word Dividers", () => {
  // prettier-ignore
  let tests = {
    "Hello World": ["hello", "world"],
    "Hello-World": ["hello", "world"],
    "Hello·World": ["hello", "world"],
    "Hello•World": ["hello", "world"],
    "Hello_World": ["hello", "world"],
    "Hello…World": ["hello", "world"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should split at word boundaries (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Multiple Word Dividers", () => {
  // prettier-ignore
  let tests = {
    "Hello  World": ["hello", "world"],
    "Hello---World": ["hello", "world"],
    "Hello.... World": ["hello", "world"],
    "Hello…...^-_-^...…World": ["hello", "world"],
    "Hello…...^-_-^...… World": ["hello", "world"],
    "Hello…...^-There-^...…World": ["hello", "there", "world"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should split at word boundaries (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Simplifying Contractions", () => {
  // prettier-ignore
  let tests = {
    "Can't": ["cant"],
    "Shouldn't": ["shouldnt"],
    "The Smith's": ["the", "smiths"],
    "This won't work": ["this", "wont", "work"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should flatten contractions (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Special Characters", () => {
  // prettier-ignore
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

describe("Retaining 'and' Symbols", () => {
  // prettier-ignore
  let tests = {
    "Hello & World": ["hello", "&", "world"],
    "Hello + World": ["hello", "+", "world"],
  };

  Object.keys(tests).forEach((input) => {
    it(`should retain 'and' symbols (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

describe("Flattening Diacritics", () => {
  // prettier-ignore
  let tests = {
    "Ḣéļḹö Ⱳôȑĺȡ": ["hello", "world"],
    "Les Misérable": ["les", "miserable"],
    "ỆᶍǍᶆṔƚÉ áéíóúýčďěňřšťžů": ["example", "aeiouycdenrstzu"]
  };

  Object.keys(tests).forEach((input) => {
    it(`should strip diacritics (${input})`, () => {
      expect(parseTokens(input)).toEqual(tests[input]);
    });
  });
});

// From Movie "Titles with Unusual Symbols"
// https://www.imdb.com/list/ls098136839/

describe("Movie Titles", () => {
  let movies = {
    "Æon Flux": ["aeon", "flux"],
    "Romeo & Juliet": ["romeo", "&", "juliet"],
    "8½": ["8"],
    "M*A*S*H": ["m", "a", "s", "h"], // this is dumb, but reasonable
    "WALL·E": ["wall", "e"],
    "What the #$*! Do We (K)now!?": ["what", "the", "do", "we", "k", "now"],
    "61*": ["61"],
    "Bigger Stronger Faster*": ["bigger", "stronger", "faster"],
    "Blood+": ["blood", "+"],
    "Tristan + Isolde": ["tristan", "+", "isolde"],
    "Patti Cake$": ["patti", "cake"],
    "*batteries not included": ["batteries", "not", "included"],
    "Bat*21": ["bat", "21"],
    "Totally F***ed Up": ["totally", "f", "ed", "up"],
    "$5 a Day": ["5", "a", "day"],
    "9½ Weeks": ["9", "weeks"],
  };

  Object.keys(movies).forEach((title) => {
    it(`should properly parse movie titles with unusual symbols (${title})`, () => {
      expect(parseTokens(title)).toEqual(movies[title]);
    });
  });
});
