import DataSource from "../modules/DataSource";
import DataSourceEntry from "../modules/DataSourceEntry";
import states from "./statesData";

let dataSource = new DataSource();
dataSource.addEntries(
  states.map((entry) => {
    return new DataSourceEntry(entry.text, entry.value);
  })
);

let renderer = (entry) => {
  return <span>{entry._text}</span>;
};

export default {
  dataSource: dataSource,
  renderer: renderer,
  count: states.length,
};
