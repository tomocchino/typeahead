import DataSource from "../../main/DataSource";
import DataSourceEntry from "../../main/DataSourceEntry";
import Typeahead from "../../main/Typeahead";

import cities from "./data";

let dataSource = new DataSource();
dataSource.setMaxResults(15);
dataSource.addEntries(cities.map((text) => new DataSourceEntry(text)));

export default function Cities() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      dataSource={dataSource}
      placeholder={`${numEntries.toLocaleString()} cities`}
    />
  );
}
