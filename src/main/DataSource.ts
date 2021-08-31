import DataSourceEntry from "./DataSourceEntry";
import parseTokens from "../util/parseTokens";

const QUERY_DELAY = 100; // Wait this many ms before invoking queryHandler

type QueryCallback = (value: string, results: Array<DataSourceEntry>) => void;
type QueryHandler = (value: string) => void;

export default class DataSource {
  private _maxResults: number;
  private _pendingQuery: number; // window.setTimeout return value
  private _queryHandler: QueryHandler;
  private _queryCallback: QueryCallback;
  private _mostRecentQuery: string;
  private _entriesSet: Set<string>;
  private _entryBuckets: Map<number, Set<DataSourceEntry>>;
  private _previousQueries: Set<string>;

  constructor() {
    this._maxResults = 10;
    this._pendingQuery = null;
    this._queryHandler = null;
    this._queryCallback = null;
    this._mostRecentQuery = "";
    this._entriesSet = new Set();
    this._entryBuckets = new Map();
    this._previousQueries = new Set();
  }

  /**
   * The addEntries method matters more than anything else here. We have to
   * dedupe entries based on their value which must be unique, and the order
   * they get inserted into `this._entryBuckets` depends on several factors:
   * 1. The original sort order of `entries`,
   * 2. The number of tokens in the entry (`getTokens`),
   * 3. The first character (charCode) of the entry text (`getText`).
   *
   * We must preserve the initial `entries` sort order inside each bucket as
   * much as possible, but we can't just iterate over `entries` and push each
   * result directly into its `this._entryBuckets.get(firstCharCode)` bucket.
   * We have to insert based the number of tokens each entry has, to make sure
   * one-token matches always come before two-token matches, and so on.
   *   eg. {a: ["Alpha", "Arizona", "Alpha Bravo", ...}
   *
   * Additionally, using the `a` bucket as a reference, we must first insert
   * all the entries whose first token starts with a, then all the entries
   * whose second token starts with a, and so on.
   *   eg. {a: ["Alpha", "Bravo Alpha", "Charlie Bravo Alpha"], ...}
   *
   * Given the following entries:
   *   ["Alpha", "Bravo", "Bravo Alpha", "Alpha Bravo", "Arizona", "Alpha"]
   *
   * The `intermediateEntryBuckets` variable will be the following:
   *   intermediateEntryBuckets = [
   *     ["Alpha", "Bravo", "Arizona"],
   *     ["Bravo Alpha", "Alpha Bravo"],
   *   ];
   *
   * Which will in turn generate the following `this._entryBuckets`:
   *   this._entryBuckets = {
   *     a: ["Alpha", "Arizona", "Alpha Bravo", "Bravo Alpha"],
   *     b: ["Bravo", "Bravo Alpha", "Alpha Bravo"],
   *   };
   */
  addEntries(entries: Array<DataSourceEntry>) {
    let uniqueEntries = [];
    let intermediateEntryBuckets = [];

    // Dedupe entries based on their `value` field, which must be unique,
    // as we build up the intermediateEntryBuckets data structure.
    entries.forEach((entry) => {
      let value = entry.getValue();
      if (!this._entriesSet.has(value)) {
        uniqueEntries.push(entry);
        this._entriesSet.add(value);
        let index = entry.getTokens().length - 1;
        if (!intermediateEntryBuckets[index]) {
          intermediateEntryBuckets[index] = [];
        }
        intermediateEntryBuckets[index].push(entry);
      }
    });

    // Now that we've created our intermediate sorted data structure, we have
    // to actually get all these entries inserted into this._entryBuckets.
    intermediateEntryBuckets.forEach((entryBucket, index) => {
      for (let ii = 0; ii <= index; ii++) {
        for (let jj = 0; jj < entryBucket.length; jj++) {
          let entry = entryBucket[jj];
          let key = entry.getTokens()[ii].charCodeAt(0);
          this.insertEntry(key, entry);
        }
      }
    });

    // Finally, we need to append entries based on their keywords if present.
    // This step has to happen last to ensure keyword matches are at the end.
    uniqueEntries.forEach((entry) => {
      let keywords = entry.getKeywords();
      if (keywords.length > 0) {
        keywords.forEach((keyword) => {
          this.insertEntry(keyword.charCodeAt(0), entry);
        });
      }
    });

    // Whenever entries are added, invoke query to append new results
    this.query(this._mostRecentQuery);
  }

  query(value: string) {
    if (!this._queryCallback) {
      return;
    }

    // Respond synchronously with whatever we have in the cache already
    let results = this.getQueryResults(value);
    this._queryCallback(value, results);

    // If we have fewer than _maxResults, invoke the _queryHandler, if
    // one is set, enabling the caller to fetch more results if needed
    if (
      value &&
      this._queryHandler &&
      results.length < this._maxResults &&
      !this._previousQueries.has(value)
    ) {
      if (this._pendingQuery) {
        clearTimeout(this._pendingQuery);
      }
      this._pendingQuery = window.setTimeout(() => {
        this._previousQueries.add(value);
        this._queryHandler(value);
        this._pendingQuery = null;
      }, QUERY_DELAY);
    }
  }

  getQueryResults(value: string): Array<DataSourceEntry> {
    let results: Set<DataSourceEntry> = new Set();
    let resultsCount = 0;
    let queryTokens = parseTokens(value);
    let firstCharCode = queryTokens[0].charCodeAt(0);
    let eligibleEntries = this._entryBuckets.get(firstCharCode) || new Set();

    if (value !== "") {
      for (let entry of Array.from(eligibleEntries)) {
        let entryTokens = entry.getTokens().concat(entry.getKeywords());
        if (tokensMatch(queryTokens, entryTokens)) {
          results.add(entry);
          resultsCount++;
        }
        if (resultsCount === this._maxResults) {
          break;
        }
      }
    }

    this._mostRecentQuery = value;
    return Array.from(results);
  }

  setMaxResults(maxResults: number) {
    this._maxResults = maxResults;
  }

  setQueryCallback(callback: QueryCallback) {
    this._queryCallback = callback;
  }

  setQueryHandler(callback: QueryHandler) {
    this._queryHandler = callback;
  }

  getNumberOfEntries() {
    return this._entriesSet.size;
  }

  private insertEntry(key: number, entry: DataSourceEntry) {
    if (!this._entryBuckets.has(key)) {
      this._entryBuckets.set(key, new Set());
    }
    if (!this._entryBuckets.get(key).has(entry)) {
      this._entryBuckets.get(key).add(entry);
    }
  }
}

function tokensMatch(queryTokens: Array<string>, entryTokens: Array<string>) {
  let numQueryTokensMatched = 0;
  let numEntryTokensChecked = 0;
  let numQueryTokens = queryTokens.length;
  let numEntryTokens = entryTokens.length;

  while (
    numQueryTokensMatched < numQueryTokens &&
    numEntryTokensChecked < numEntryTokens
  ) {
    let queryToken = queryTokens[numQueryTokensMatched];
    let entryToken = entryTokens[numEntryTokensChecked];
    // If the entry token starts with the query token, it's a match. Increment
    // matched query token count and return true if we have the number we need.
    if (
      entryToken.startsWith(queryToken) &&
      ++numQueryTokensMatched === numQueryTokens
    ) {
      return true;
    }
    numEntryTokensChecked++;
  }

  return numQueryTokensMatched === numQueryTokens;
}
