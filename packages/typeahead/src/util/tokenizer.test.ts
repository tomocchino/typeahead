import DataSource from "../main/DataSource";
import DataSourceEntry from "../main/DataSourceEntry";
import flatten from "./flatten";
import parseTokens from "./parseTokens";

function createDataSource(texts: Array<string>) {
  const dataSource = new DataSource();
  dataSource.addEntries(texts.map((text) => new DataSourceEntry(text)));
  return dataSource;
}

test.each<[string, ReadonlyArray<string>]>([
  ["Hello", ["hello"]],
  ["HELLO", ["hello"]],
  ["HeLlO", ["hello"]],
  ["Ḣéļḹö Ⱳôȑĺȡ", ["hello", "world"]],
  ["Les Misérable", ["les", "miserable"]],
  ["ỆᶍǍᶆṔƚÉ áéíóúýčďěňřšťžů", ["example", "aeiouycdenrstzu"]],
  ["Æon Flux", ["aeon", "flux"]],
  ["ŒUVRE œuf", ["oeuvre", "oeuf"]],
  ["Straße STRAẞE", ["strasse", "strasse"]],
  ["Łódź Smør Đorđe Þór", ["lodz", "smor", "dorde", "thor"]],
  ["ﬀ ﬁ ﬂ ﬃ ﬄ ﬆ", ["ff", "fi", "fl", "ffi", "ffl", "st"]],
  ["ᴬᴮ", ["ab"]],
  ["Ǆ Ĳ", ["dz", "ij"]],
  ["８½ ١٢٣", ["８", "١٢٣"]],
  ["İSTANBUL", ["istanbul"]],
  ["  Alpha\tBravo\n ", ["alpha", "bravo"]],
  ["Hello-World", ["hello", "world"]],
  ["Hello·World", ["hello", "world"]],
  ["Hello•World", ["hello", "world"]],
  ["Hello_World", ["hello", "world"]],
  ["Hello…World", ["hello", "world"]],
  ["Hello(World)", ["hello", "world"]],
  ["Hello<World>", ["hello", "world"]],
  ["Hello:  World", ["hello", "world"]],
  ["Hello---World", ["hello", "world"]],
  ["¡Hello World!", ["hello", "world"]],
  ["Hello #1 World", ["hello", "1", "world"]],
  ["Hello #@$%! World", ["hello", "world"]],
  ["Hello…...^-There-^...…World", ["hello", "there", "world"]],
  ["A$B$C$D$E$F$G$H", ["a", "b", "c", "d", "e", "f", "g", "h"]],
  ["Can't", ["cant"]],
  ["The Smith's", ["the", "smiths"]],
  ["This won’t work, will it?", ["this", "wont", "work", "will", "it"]],
  ["Hello“World”", ["hello", "world"]],
  ["\"Hello'World'\"", ["helloworld"]],
  ["He+llo", ["he", "+", "llo"]],
  ["Hello +", ["hello", "+"]],
  ["Hello+World", ["hello", "+", "world"]],
  ["Hello & World", ["hello", "&", "world"]],
  ["Hello&World", ["hello", "&", "world"]],
  ["WALL·E", ["wall", "e"]],
  ["61*", ["61"]],
  ["Bigger Stronger Faster*", ["bigger", "stronger", "faster"]],
  ["Blood+", ["blood", "+"]],
  ["Patti Cake$", ["patti", "cake"]],
  ["*batteries not included", ["batteries", "not", "included"]],
  ["Bat*21", ["bat", "21"]],
  ["$5 a Day", ["5", "a", "day"]],
  ["M*A*S*H", ["m", "a", "s", "h"]],
  ["What the #$*! Do We (K)now!?", ["what", "the", "do", "we", "k", "now"]],
  ["Totally F***ed Up", ["totally", "f", "ed", "up"]],
  ["東京、大阪。", ["東京", "大阪"]],
  ["がっこう ガンダム", ["がっこう", "ガンダム"]],
  ["中文地图", ["中文地图"]],
  ["한국어", ["한국어"]],
  ["МОСКВА Йошкар-Ола", ["москва", "йошкар", "ола"]],
  ["Αθήνα", ["αθήνα"]],
  ["العَرَبِيَّة", ["العَرَبِيَّة"]],
  ["हिन्दी", ["हिन्दी"]],
  ["שָׁלוֹם", ["שָׁלוֹם"]],
  ["ภาษาไทย", ["ภาษาไทย"]],
  ["می‌روم", ["می‌روم"]],
  ["𠮷野家", ["𠮷野家"]],
  ["Cafe\u0301 東京", ["cafe", "東京"]],
  ["", []],
  [" \t\n ", []],
  ["---…!?", []],
  ["\u0301\u3099", []],
  ["🎮🚀", []],
])("tokenizes %j as %j", (value, tokens) => {
  expect(parseTokens(value)).toEqual(tokens);
  expect(parseTokens(tokens.join(" "))).toEqual(tokens);
});

test.each([
  ["cafe", "Café"],
  ["café", "Cafe\u0301"],
  ["strasse", "Straße"],
  ["aeon", "Æon"],
  ["oeuvre", "Œuvre"],
  ["lodz", "Łódź"],
  ["smor", "Smør"],
  ["fiction", "ﬁction"],
  [" alpha", "Alpha"],
  ["alpha ", "Alpha"],
  ["bravo", "Alpha-Bravo"],
  ["cant", "Can't"],
  ["東京", "東京タワー"],
  ["ガ", "カ\u3099ンダム"],
  ["カ\u3099", "ガンダム"],
  ["한국", "한국어"],
  ["한국".normalize("NFD"), "한국어"],
  ["моск", "Москва"],
  ["中文", "中文地图"],
  ["αθή", "Αθήνα"],
  ["हिन", "हिन्दी"],
  ["العَرَ", "العَرَبِيَّة"],
  ["שָׁ", "שָׁלוֹם"],
  ["ภาษา", "ภาษาไทย"],
  ["𠮷", "𠮷野家"],
])("matches %j against %j", (query, text) => {
  const dataSource = createDataSource([text]);
  expect(
    dataSource.getQueryResults(query).map((entry) => entry.getText())
  ).toEqual([text]);
});

test.each([
  ["東京", "大阪"],
  ["Москва", "Киев"],
  ["カ", "ガンダム"],
  ["は", "ば"],
  ["й", "и"],
  ["ё", "е"],
  ["α", "ά"],
  ["हिंद", "हिन्दी"],
  ["東京", "Tokyo"],
  ["𠮷", "𠮸"],
  ["", "Alpha"],
  [" ", "Alpha"],
  ["---", "Alpha"],
  ["🎮", "Alpha"],
  ["---", "!!!"],
  ["\u0301", "\u0301"],
])("does not match %j against %j", (query, text) => {
  expect(createDataSource([text]).getQueryResults(query)).toEqual([]);
});

test.each([
  ["東京、大阪。", "東京 大阪"],
  ["カ\u3099ンダム", "ガンダム"],
  ["Москва Йошкар-Ола", "москва йошкар ола"],
  ["العَرَبِيَّة", "العَرَبِيَّة"],
  ["हिन्दी", "हिन्दी"],
  ["می‌روم", "می‌روم"],
  ["Café\t東京", "cafe 東京"],
  ["Æ Œ ß ẞ Ł Ø ﬁ", "ae oe ss ss l o fi"],
  ["Hello, World,", "hello  world"],
  ["Hello+World", "hello + world"],
])("flattens %j to %j", (value, expected) => {
  expect(flatten(value)).toBe(expected);
  expect(parseTokens(expected)).toEqual(parseTokens(value));
});

test("keeps distinct non-Latin entries separate in the same data source", () => {
  const dataSource = createDataSource([
    "東京",
    "大阪",
    "Москва",
    "Киев",
    "!!!",
  ]);
  expect(
    dataSource.getQueryResults("東京").map((entry) => entry.getText())
  ).toEqual(["東京"]);
  expect(
    dataSource.getQueryResults("моск").map((entry) => entry.getText())
  ).toEqual(["Москва"]);
});

test("normalizes keywords without modifying display text, values, or raw data", () => {
  const rawData = { keywords: ["ŒUVRE", "Café-東京", "ガンダム", "---"] };
  const entry = new DataSourceEntry("🎮", "Original-ID", rawData);
  const dataSource = new DataSource();
  dataSource.addEntries([entry]);
  for (const query of ["oeuvre", "cafe 東京", "東京", "カ\u3099"]) {
    expect(dataSource.getQueryResults(query)).toEqual([entry]);
  }
  expect(entry.getText()).toBe("🎮");
  expect(entry.getValue()).toBe("Original-ID");
  expect(entry.getRawData()).toBe(rawData);
  expect(rawData.keywords).toEqual(["ŒUVRE", "Café-東京", "ガンダム", "---"]);
  expect(entry.getKeywords()).toEqual(["oeuvre", "cafe", "東京", "ガンダム"]);
  expect(dataSource.getQueryResults("---")).toEqual([]);
});

test("preserves keyword ordering and deduplication after normalization", () => {
  const dataSource = new DataSource();
  const alias = new DataSourceEntry("Other", "other", {
    keywords: ["Café", "Café"],
  });
  const text = new DataSourceEntry("Café", "cafe", { keywords: ["CAFÉ"] });
  dataSource.addEntries([alias, text]);
  expect(dataSource.getQueryResults("cafe")).toEqual([text, alias]);
});

test("allows empty labels with keywords without indexing empty tokens", () => {
  const dataSource = createDataSource(["", " ", "---", "\u0301"]);
  const entry = new DataSourceEntry("", "keyword", { keywords: ["Tokyo"] });
  dataSource.addEntries([entry]);
  expect(dataSource.getQueryResults(" ")).toEqual([]);
  expect(dataSource.getQueryResults("tok")).toEqual([entry]);
  expect(dataSource.getNumberOfEntries()).toBe(5);
});

test("an empty query stays empty when asynchronous results arrive", () => {
  const dataSource = createDataSource([]);
  const callback = jest.fn();
  dataSource.setQueryCallback(callback);
  dataSource.query("Tokyo");
  dataSource.query("---");
  dataSource.addEntries([new DataSourceEntry("Tokyo")]);
  expect(callback).toHaveBeenLastCalledWith("---", []);
});

describe("Remote queries", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { setTimeout },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  });

  test.each(["", " \t\n ", "---", "🎮", "\u0301"])(
    "does not send a tokenless query %j",
    (query) => {
      const dataSource = createDataSource(["", "!!!", "東京"]);
      const handler = jest.fn();
      const callback = jest.fn();
      dataSource.setQueryHandler(handler);
      dataSource.setQueryCallback(callback);
      dataSource.query(query);
      jest.runAllTimers();
      expect(handler).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(query, []);
    }
  );

  test.each(["", "  ", "---", "🎮", "\u0301"])(
    "cancels a pending request when the query becomes tokenless (%j)",
    (query) => {
      const dataSource = createDataSource([]);
      const handler = jest.fn();
      dataSource.setQueryHandler(handler);
      dataSource.setQueryCallback(jest.fn());
      dataSource.query("Tokyo");
      jest.advanceTimersByTime(50);
      dataSource.query(query);
      jest.runAllTimers();
      expect(handler).not.toHaveBeenCalled();
      dataSource.query("Tokyo");
      jest.runAllTimers();
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith("Tokyo");
    }
  );

  test("keeps original Unicode in debounced requests", () => {
    const dataSource = createDataSource([]);
    const handler = jest.fn();
    dataSource.setQueryHandler(handler);
    dataSource.setQueryCallback(jest.fn());
    dataSource.query("がっこう Café");
    jest.advanceTimersByTime(99);
    expect(handler).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(handler).toHaveBeenCalledWith("がっこう Café");
  });
});
