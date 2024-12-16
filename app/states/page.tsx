"use client";

import { DataSource, DataSourceEntry, Typeahead } from "../../src";
import states from "./data";
import examplesClassNames from "../../styles/examplesClassNames";

let dataSource = new DataSource();
dataSource.addEntries(
  states.map((entry) => {
    return new DataSourceEntry(entry.text, entry.value);
  })
);

let renderer = (entry: DataSourceEntry) => {
  return <span>{entry.getText()}</span>;
};

export default function StatesExample() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      renderer={renderer}
      dataSource={dataSource}
      classNames={examplesClassNames}
      showHintText={true}
      placeholder={`${numEntries.toLocaleString()} states`}
    />
  );
}
