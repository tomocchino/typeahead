import DataSource from "/src/DataSource";
import DataSourceEntry from "/src/DataSourceEntry";
import Typeahead from "/src/Typeahead";

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
