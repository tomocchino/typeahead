import Head from "next/head";
import DataSource from "../../modules/DataSource";
import DataSourceEntry from "../../modules/DataSourceEntry";
import Typeahead from "../../modules/Typeahead";

import states from "./data";

let dataSource = new DataSource();
dataSource.addEntries(
  states.map((entry) => {
    return new DataSourceEntry(entry.text, entry.value);
  })
);

let renderer = (entry) => {
  return <span>{entry.getText()}</span>;
};

export default function States() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      placeholder={`${numEntries.toLocaleString()} states`}
      dataSource={dataSource}
      renderer={renderer}
    />
  );
}
