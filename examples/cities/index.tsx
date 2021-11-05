import { DataSource, DataSourceEntry, Typeahead } from "../../src";
import cities from "./data";

let dataSource = new DataSource();
dataSource.setMaxResults(15);
dataSource.addEntries(cities.map((text) => new DataSourceEntry(text)));

export default function CitiesExample() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      dataSource={dataSource}
      placeholder={`${numEntries.toLocaleString()} cities`}
    />
  );
}