import flatten from "./flatten";

describe("Capitalization", () => {
  // prettier-ignore
  let tests = {
    "Hello": "hello",
    "HELLO": "hello",
    "HeLlO": "hello",
  };

  Object.keys(tests).forEach((input) => {
    it(`should convert to lowercase (${input})`, () => {
      expect(flatten(input)).toEqual(tests[input]);
    });
  });
});

describe("Flattening Diacritics", () => {
  let tests = {
    "Ḣéļḹö Ⱳôȑĺȡ": "hello world",
    "Les Misérable": "les miserable",
    "ỆᶍǍᶆṔƚÉ áéíóúýčďěňřšťžů": "example aeiouycdenrstzu",
  };

  Object.keys(tests).forEach((input) => {
    it(`should strip diacritics (${input})`, () => {
      expect(flatten(input)).toEqual(tests[input]);
    });
  });
});

describe("Special Characters", () => {
  let tests = {
    "Hello World!": "hello world",
    "Hello, World,": "hello  world",
    "¡Hello World!": "hello world",
    "Hello Worlds'": "hello worlds",
    "Hello #1 World": "hello  1 world",
    "Hello #@$%! World": "hello       world",
    "Hello: World II": "hello  world ii",
  };

  Object.keys(tests).forEach((input) => {
    it(`should turn most special characters into spaces (${input})`, () => {
      expect(flatten(input)).toEqual(tests[input]);
    });
  });
});

describe("Removing Apostrophes", () => {
  let tests = {
    "Can't": "cant",
    "The Smith's": "the smiths",
    "This won't work, will it?": "this wont work  will it",
    "Hello'World'": "helloworld",
  };

  Object.keys(tests).forEach((input) => {
    it(`should flatten contractions (${input})`, () => {
      expect(flatten(input)).toEqual(tests[input]);
    });
  });
});

describe("Using flatten with Array::map", () => {
  it(`should flatten an array of words`, () => {
    let testArray = ["Héllo", "World!"];
    let flattenedArray = testArray.map(flatten);
    expect(flattenedArray).toEqual(["hello", "world"]);
  });
});
