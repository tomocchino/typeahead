import DataSource from "./DataSource";
import DataSourceEntry from "./DataSourceEntry";

function flatten(results) {
  return results.map((entry) => entry.getText());
}

function createTestDataSource(entries, maxResults) {
  let dataSource = new DataSource();
  dataSource.addEntries(entries.map((text) => new DataSourceEntry(text)));
  dataSource.setMaxResults(maxResults || 4);
  return dataSource;
}

describe("Alpha Bravo tests", () => {
  let dataSource = createTestDataSource([
    "Alpha Bravo Charlie",
    "Alpha Bravo",
    "Alpha",
    "Bravo Alpha",
    "Bravo",
    "Charlie Bravo Alpha",
    "Alpha Bravo Alpha",
  ]);

  it("should return matches in the right order (query = 'alpha')", () => {
    let results = flatten(dataSource.getQueryResults("alpha"));
    expect(results).toEqual([
      "Alpha",
      "Alpha Bravo",
      "Bravo Alpha",
      "Alpha Bravo Charlie",
    ]);
  });

  it("should return matches in the right order (query = 'bravo')", () => {
    let results = flatten(dataSource.getQueryResults("bravo"));
    expect(results).toEqual([
      "Bravo",
      "Bravo Alpha",
      "Alpha Bravo",
      "Alpha Bravo Charlie",
    ]);
  });

  it("should match multiple instances of the same token (query = 'alpha alpha')", () => {
    let results = flatten(dataSource.getQueryResults("alpha alpha"));
    expect(results).toEqual(["Alpha Bravo Alpha"]);
  });

  it("should match multiple instances of the same substring token (query = 'al al')", () => {
    let results = flatten(dataSource.getQueryResults("al al"));
    expect(results).toEqual(["Alpha Bravo Alpha"]);
  });
});

describe("Buffalo Creek tests", () => {
  let dataSource = createTestDataSource([
    "Buffalo Creek",
    "Chicago Creek",
    "Chicago",
    "Creek Town",
    "Creekside",
  ]);

  it("should match the correct number of words (query = 'c c')", () => {
    let results = flatten(dataSource.getQueryResults("c c"));
    expect(results).toContain("Chicago Creek");
    expect(results).not.toContain("Chicago");
    expect(results).not.toContain("Creekside");
  });

  it("should return single word matches first (query = 'c')", () => {
    let results = flatten(dataSource.getQueryResults("c"));
    expect(results).toEqual([
      "Chicago",
      "Creekside",
      "Chicago Creek",
      "Creek Town",
    ]);
  });

  it("should return single word matches first (query = 'creek')", () => {
    let results = flatten(dataSource.getQueryResults("creek"));
    expect(results).toEqual([
      "Creekside",
      "Chicago Creek",
      "Creek Town",
      "Buffalo Creek",
    ]);
  });
});

describe("Lake Tahoe tests", () => {
  let dataSource = createTestDataSource([
    "Lake Tahoe",
    "Lake Tahoe",
    "South Lake Tahoe",
    "Tahoe",
  ]);

  it("should not allow duplicate entries to be added (query = 'lake tahoe')", () => {
    let results = dataSource.getQueryResults("lake tahoe");
    expect(results).toHaveLength(2); // Lake Tahoe, South Lake Tahoe
  });

  it("should return entries with last word matching the query (query = 'tahoe')", () => {
    let results = flatten(dataSource.getQueryResults("tahoe"));
    expect(results).toEqual(["Tahoe", "Lake Tahoe", "South Lake Tahoe"]);
  });

  it("should return entries with middle word matching the query (query = 'lake')", () => {
    let results = flatten(dataSource.getQueryResults("lake"));
    expect(results).toEqual(["Lake Tahoe", "South Lake Tahoe"]);
  });

  it("should return entries with two words matching the query (query = 'lake tahoe')", () => {
    let results = flatten(dataSource.getQueryResults("lake tahoe"));
    expect(results).toEqual(["Lake Tahoe", "South Lake Tahoe"]);
  });

  it("should return only entries that have a prefix match (query = 'ake')", () => {
    let results = dataSource.getQueryResults("ake");
    expect(results).toHaveLength(0);
  });
});

describe("Duplicates tests", () => {
  let dataSource = new DataSource();
  dataSource.addEntries([
    new DataSourceEntry("A Star Is Born", "asib2018"),
    new DataSourceEntry("A Star Is Born", "asib1954"),
    new DataSourceEntry("A Star Is Born", "asib1976"),
    new DataSourceEntry("A Star Is Born", "asib1937"),
    new DataSourceEntry("A Star Is Born", "asib2010"),
    new DataSourceEntry("Stars Are Nice", "asib2018"), // Duplicate!
    new DataSourceEntry("Hey Look At Me", "asib2018"), // Duplicate!
  ]);

  it("should allow duplicate entries with unique values (query = 'A Star Is Born')", () => {
    let results = flatten(dataSource.getQueryResults("A Star Is Born"));
    expect(results).toHaveLength(5);
  });

  it("should only accept the first entry for a given value (query = 'star')", () => {
    let results = flatten(dataSource.getQueryResults("star"));
    expect(results).toHaveLength(5);
  });

  it("should only accept the first entry for a particular value (query = 'look')", () => {
    let results = flatten(dataSource.getQueryResults("look"));
    expect(results).toHaveLength(0);
  });
});

describe("Keywords tests", () => {
  let dataSource = new DataSource();
  dataSource.setMaxResults(4);
  dataSource.addEntries([
    new DataSourceEntry("one", "one", { keywords: ["first", "worst"] }),
    new DataSourceEntry("two", "two", { keywords: ["second", "best"] }),
    new DataSourceEntry("three", "three", { keywords: ["third"] }),
    new DataSourceEntry("four", "four", { keywords: ["fourth"] }),
    new DataSourceEntry("five", "five", { keywords: ["fifth"] }),
  ]);

  it("should return matches based on keywords (query = 'worst')", () => {
    let results = flatten(dataSource.getQueryResults("worst"));
    expect(results).toEqual(["one"]); // 'one' matches on keyword 'worst'
  });

  it("should return matches based on keywords (query = 'best')", () => {
    let results = flatten(dataSource.getQueryResults("best"));
    expect(results).toEqual(["two"]); // 'two' matches on keyword 'best'
  });

  it("should return only one instance of each match (query = 't')", () => {
    let results = flatten(dataSource.getQueryResults("t"));
    expect(results).toEqual(["two", "three"]); // 't' matches both 'three' and 'third'
  });

  it("should return text matches before keyword matches (query = 'f')", () => {
    let results = flatten(dataSource.getQueryResults("f"));
    expect(results).toEqual(["four", "five", "one"]); // 'one' matches on keyword 'first'
  });
});

describe("Titan Movie tests", () => {
  // Before 1c4dbef, this would fail because there were multiple 'The Titan'
  // entries in the 't' entryBucket, causing the count to be off. It took so
  // much debugging to figure that out, sigh.
  let dataSource = createTestDataSource([
    "Titan",
    "The Titan",
    "Two Titans",
    "Attack on Titan II: The Roar of Awakening Some Long Thing",
  ]);

  it("should return all matching entries for the query 'titan'", () => {
    let results = dataSource.getQueryResults("titan");
    expect(results).toHaveLength(4);
  });
});
