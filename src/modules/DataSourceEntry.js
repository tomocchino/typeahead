import parseTokens from "../util/parseTokens";

export default class DataSourceEntry {
  constructor(text, value, rawData = {}) {
    this._text = text;
    this._value = value || text;
    this._rawData = rawData;
    this._tokens = parseTokens(text);
    this._keywords = rawData.keywords || [];
  }
  getText() {
    return this._text;
  }
  getValue() {
    return this._value;
  }
  getRawData() {
    return this._rawData;
  }
  getTokens() {
    return this._tokens;
  }
  getKeywords() {
    return this._keywords;
  }
}
