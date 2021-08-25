import DataSource from "/src/main/DataSource";
import DataSourceEntry from "/src/main/DataSourceEntry";
import Typeahead from "/src/main/Typeahead";

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
