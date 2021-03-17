import DataSource from "./DataSource";
import DataSourceEntry from "./DataSourceEntry";

function flatten(results) {
  return results.map(entry => entry.getText());
}

function createTestDataSource(entries) {
  let dataSource = new DataSource();
  dataSource.addEntries(entries.map(text => new DataSourceEntry(text)));
  dataSource.setMaxResults(4);
  return dataSource;
}

describe("DataSource", () => {
  let dataSource = createTestDataSource([
    // Creek and C
    "Buffalo Creek",
    "Chicago Creek",
    "Chicago",
    "Creek Town",
    "Creekside",
    // Tahoe cases
    "Lake Tahoe",
    "Lake Tahoe",
    "South Lake Tahoe",
    "Tahoe",
    // ABCs of tokens
    "Alpha Bravo Charlie",
    "Alpha Bravo",
    "Alpha",
    "Bravo Alpha",
    "Bravo",
    "Charlie Bravo Alpha"
  ]);

  it("should not allow duplicate entries to be added (query = 'lake tahoe')", () => {
    let results = dataSource.getQueryResults("lake tahoe");
    expect(results).toHaveLength(2); // Lake Tahoe, South Lake Tahoe
  });

  it("should match correct number of words (query = 'c c')", () => {
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
      "Creek Town"
    ]);
  });

  it("should return single word matches first (query = 'creek')", () => {
    let results = flatten(dataSource.getQueryResults("creek"));
    expect(results).toEqual([
      "Creekside",
      "Chicago Creek",
      "Creek Town",
      "Buffalo Creek"
    ]);
  });

  it("should return matches in the right order (query = 'alpha')", () => {
    let results = flatten(dataSource.getQueryResults("alpha"));
    expect(results).toEqual([
      "Alpha",
      "Alpha Bravo",
      "Bravo Alpha",
      "Alpha Bravo Charlie"
    ]);
  });

  it("should return matches in the right order (query = 'bravo')", () => {
    let results = flatten(dataSource.getQueryResults("bravo"));
    expect(results).toEqual([
      "Bravo",
      "Bravo Alpha",
      "Alpha Bravo",
      "Alpha Bravo Charlie"
    ]);
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
});
