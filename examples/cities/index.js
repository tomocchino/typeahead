import DataSource from "/src/DataSource";
import DataSourceEntry from "/src/DataSourceEntry";
import Typeahead from "/src/Typeahead";

import cities from "./data";

let dataSource = new DataSource();
dataSource.setMaxResults(15);
dataSource.addEntries(cities.map((text) => new DataSourceEntry(text)));

export default function Cities() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      placeholder={`${numEntries.toLocaleString()} cities`}
      dataSource={dataSource}
    />
  );
}
