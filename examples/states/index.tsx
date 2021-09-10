import { DataSource, DataSourceEntry, Typeahead } from "../../src";
import states from "./data";

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
      placeholder={`${numEntries.toLocaleString()} states`}
      dataSource={dataSource}
      renderer={renderer}
    />
  );
}
