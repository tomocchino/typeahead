import parseTokens from "./parseTokens";

describe("Word Separator Tests", () => {
  it("should parse space separated words (Hello World)", () => {
    let tokens = parseTokens("Hello World");
    expect(tokens).toEqual(["hello", "world"]);
  });

  it("should parse multiple-space separated words (Hello  World)", () => {
    let tokens = parseTokens("Hello World");
    expect(tokens).toEqual(["hello", "world"]);
  });

  it("should parse hyphen separated words (Hello-World)", () => {
    let tokens = parseTokens("Hello-World");
    expect(tokens).toEqual(["hello", "world"]);
  });

  it("should remove & and other special characters (Hello & To + The $ World)", () => {
    let tokens = parseTokens("Hello & To + The $ World");
    expect(tokens).toEqual(["hello", "to", "the", "world"]);
  });

  it("should parse underscore separated words (Hello_World)", () => {
    let tokens = parseTokens("Hello_World");
    expect(tokens).toEqual(["hello", "world"]);
  });

  it("should parse out other non-letter characters (Hello_!$World)", () => {
    let tokens = parseTokens("Hello_ !$ _World");
    expect(tokens).toEqual(["hello", "world"]);
  });

  it("should parse out trailing non-letter characters (Hello World!)", () => {
    let tokens = parseTokens("Hello World!");
    expect(tokens).toEqual(["hello", "world"]);
  });
});

// From Movie "Titles with Unusual Symbols"
// https://www.imdb.com/list/ls098136839/

describe("Movie Title Tests", () => {
  let movies = {
    "Æon Flux": ["aeon", "flux"],
    "Romeo & Juliet": ["romeo", "juliet"],
    "8½": ["8"],
    "M*A*S*H": ["m", "a", "s", "h"], // this is dumb
    "WALL·E": ["wall", "e"],
    "What the #$*! Do We (K)now!?": ["what", "the", "do", "we", "k", "now"], // this is dumb
    "61*": ["61"],
    "Bigger Stronger Faster*": ["bigger", "stronger", "faster"],
    "Blood+": ["blood"],
    "Tristan + Isolde": ["tristan", "isolde"],
    "Patti Cake$": ["patti", "cake"],
    "*batteries not included": ["batteries", "not", "included"],
    "Bat*21": ["bat", "21"],
    "Totally F***ed Up": ["totally", "f", "ed", "up"], // this is dumb
    "$5 a Day": ["5", "a", "day"],
    "9½ Weeks": ["9", "weeks"],
  };

  Object.keys(movies).forEach((title) => {
    it(`should parse movie titles with unusual symbols (${title})`, () => {
      expect(parseTokens(title)).toEqual(movies[title]);
    });
  });
});
