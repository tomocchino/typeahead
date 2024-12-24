import parseTokens from "../util/parseTokens";

type RawData = { [key: string]: any } | null;

export default class DataSourceEntry {
  private text: string;
  private value: string;
  private rawData: RawData;
  private tokens: Array<string>;
  private keywords: Array<string>;

  constructor(text: string, value: string = text, rawData?: RawData) {
    this.text = text;
    this.value = value;
    this.rawData = rawData ?? {};
    this.tokens = parseTokens(text);
    this.keywords = this.rawData.keywords ?? [];
  }
  getText() {
    return this.text;
  }
  getValue() {
    return this.value;
  }
  getRawData() {
    return this.rawData;
  }
  getTokens() {
    return this.tokens;
  }
  getKeywords() {
    return this.keywords;
  }
}
