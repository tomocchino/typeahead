import parseTokens from "../util/parseTokens";

export default class DataSourceEntry {
  private _text: string;
  private _value: string;
  private _rawData: { keywords?: Array<string> };
  private _tokens: Array<string>;
  private _keywords: Array<string>;

  constructor(text: string, value: string = text, rawData = null) {
    this._text = text;
    this._value = value;
    this._rawData = rawData;
    this._tokens = parseTokens(text);
    this._keywords = rawData?.keywords || [];
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
