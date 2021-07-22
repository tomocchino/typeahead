import parseTokens from "../util/parseTokens";

export default class DataSource {
  constructor() {
    this._maxResults = 10;
    this._queryHandler = null;
    this._queryCallback = null;
    this._previousQueries = new Set();
    this._mostRecentQuery = null;
    this._entriesSet = new Set();
    this._entryBuckets = new Map();
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
   * result directly into its `this._entryBuckets[firstCharCode]` bucket. We
   * have to insert based the number of tokens each entry has, to make sure
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
   * The `filteredEntries` intermediate variable will be the following:
   *   filteredEntries = [
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
  addEntries(entries) {
    let filteredEntries = [];

    entries.forEach((entry) => {
      // Dedupe entries based on their `value` field, which must be unique
      let value = entry.getValue();
      if (this._entriesSet.has(value)) {
        return;
      }
      this._entriesSet.add(value);

      let index = entry.getTokens().length - 1;
      if (!filteredEntries[index]) {
        filteredEntries[index] = [];
      }
      filteredEntries[index].push(entry);
    });

    filteredEntries.forEach((entryBucket, index) => {
      for (let ii = 0; ii <= index; ii++) {
        for (let jj = 0; jj < entryBucket.length; jj++) {
          let entry = entryBucket[jj];
          let token = entry.getTokens()[ii];
          let charCode = token.charCodeAt(0);
          if (!this._entryBuckets.has(charCode)) {
            this._entryBuckets.set(charCode, []);
          }
          this._entryBuckets.get(charCode).push(entry);
        }
      }
    });

    // When entries are added, invoke query again to append new results
    if (this._mostRecentQuery) {
      this.query(this._mostRecentQuery);
    }
  }

  query(value) {
    if (!this._queryCallback) {
      return null;
    }
    let results = this.getQueryResults(value);
    this._queryCallback(value, results);
    this._mostRecentQuery = value;
  }

  getQueryResults(value) {
    let resultCount = 0;
    let results = new Set();
    let queryTokens = parseTokens(value);
    let eligibleEntries = this.getEligibleEntries(queryTokens[0]);

    if (value !== "") {
      for (let entry of eligibleEntries) {
        let entryTokens = entry.getTokens();
        if (tokensMatch(queryTokens, entryTokens)) {
          results.add(entry);
          resultCount++;
        }
        if (resultCount === this._maxResults) {
          break;
        }
      }
    }

    if (
      this._queryHandler &&
      resultCount < this._maxResults &&
      !this._previousQueries.has(value)
    ) {
      // Let the client know we don't have enough results so it can go to the
      // network to add more entries if needed
      this._previousQueries.add(value);
      this._queryHandler(value);
    }

    // Respond synchronously with whatever we have in the cache already
    return Array.from(results);
  }

  getEligibleEntries(token) {
    return this._entryBuckets.get(token.charCodeAt(0)) || [];
  }

  setMaxResults(maxResults) {
    this._maxResults = maxResults;
  }

  setQueryCallback(callback) {
    this._queryCallback = callback;
  }

  setQueryHandler(callback) {
    this._queryHandler = callback;
  }

  getCount() {
    return this._entriesSet.size;
  }
}

function tokensMatch(queryTokens, entryTokens) {
  let matchedEntryTokens = {};
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
    // If we haven't used this entry token yet, and the text of the token starts with
    // the query token's text, we have a match.
    if (!matchedEntryTokens[entryToken] && entryToken.startsWith(queryToken)) {
      // Since we have a match, we'll increment the number of query tokens that have
      // been matched so far. If we now have the number we need, we can return true
      // for this entry without doing any additional work.
      if (++numQueryTokensMatched === numQueryTokens) {
        return true;
      }
      // If we don't yet have the number of matched tokens we need, we mark the
      // current entry token as used and continue on to the next one.
      matchedEntryTokens[entryToken] = true;
    } else {
      // This entry token wasn't a match, but that doesn't mean we can break out just
      // yet. We still need to check the rest of the entry tokens if there are more.
      numEntryTokensChecked++;
    }
  }

  return numQueryTokensMatched === numQueryTokens;
}
