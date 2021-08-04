import DataSource from "../../modules/DataSource";
import DataSourceEntry from "../../modules/DataSourceEntry";
import Typeahead from "../../modules/Typeahead";

import actors from "./data";
import styles from "./styles.module.css";

let dataSource = new DataSource();
dataSource.addEntries(
  actors.map((entry) => {
    return new DataSourceEntry(entry.name, entry.id, entry);
  })
);

let renderer = (entry) => {
  let data = entry.getRawData();
  return (
    <span>
      <span className={styles.Name}>{data.name}</span>
      <span className={styles.Movie}>{data.movie}</span>
    </span>
  );
};

export default function Actors() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      placeholder={`${numEntries.toLocaleString()} actors`}
      dataSource={dataSource}
      renderer={renderer}
    />
  );
}
