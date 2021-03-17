import parseTokens from "../util/parseTokens";

export default class DataSourceEntry {
  constructor(text, value, rawData) {
    this._text = text;
    this._value = value || text;
    this._rawData = rawData || {};
    this._tokens = parseTokens(text);
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
}
