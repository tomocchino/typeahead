import DataSource from "../../modules/DataSource";
import DataSourceEntry from "../../modules/DataSourceEntry";
import Typeahead from "../../modules/Typeahead";

import cities from "./data";

let dataSource = new DataSource();
dataSource.setMaxResults(15);
dataSource.addEntries(cities.map((text) => new DataSourceEntry(text)));

let renderer = (entry) => {
  return <span>{entry.getText()}</span>;
};

export default function Cities() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      placeholder={`${numEntries.toLocaleString()} cities`}
      dataSource={dataSource}
      renderer={renderer}
    />
  );
}
