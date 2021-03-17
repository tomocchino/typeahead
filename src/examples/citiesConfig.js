import DataSource from "../modules/DataSource";
import DataSourceEntry from "../modules/DataSourceEntry";
import cities from "./citiesData";

let dataSource = new DataSource();
dataSource.setMaxResults(15);
dataSource.addEntries(cities.map((text) => new DataSourceEntry(text)));

let renderer = (entry) => {
  return <span>{entry._text}</span>;
};

export default {
  dataSource: dataSource,
  renderer: renderer,
  count: cities.length,
};
