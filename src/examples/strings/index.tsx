import DataSource from "../../main/DataSource";
import DataSourceEntry from "../../main/DataSourceEntry";
import Typeahead from "../../main/Typeahead";

import styles from "./styles.module.css";

const CHARS =
  "abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz aeiou" +
  "abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz aeiou" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ AEIOU" +
  "0123456789!~#$%&*_+-åéîøüç                                 ";

function makeString(length: number) {
  let string = "";
  for (let ii = 0; ii < length; ii++) {
    string += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return string;
}

let entries: Array<string> = [];
for (let ii = 0; ii < 100000; ii++) {
  let length = Math.floor(8 + Math.random() * 12);
  entries.push(makeString(length).trim());
}

let dataSource = new DataSource();
dataSource.addEntries(
  entries.map((entry) => {
    return new DataSourceEntry(entry);
  })
);

let renderer = (entry: DataSourceEntry) => {
  return (
    <span>
      <span className={styles.String}>{entry.getText()}</span>
      <span className={styles.Tokens}>
        {`tokens: [${entry.getTokens().join(", ")}]`}
      </span>
    </span>
  );
};

export default function StringsExample() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      placeholder={`${numEntries.toLocaleString()} random strings`}
      dataSource={dataSource}
      renderer={renderer}
    />
  );
}
