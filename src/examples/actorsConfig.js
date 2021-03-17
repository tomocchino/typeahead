import DataSource from "../modules/DataSource";
import DataSourceEntry from "../modules/DataSourceEntry";
import actors from "./actorsData";
import styles from "./actorsStyles.module.css";

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
      <span className={styles.name}>{data.name}</span>
      <span className={styles.movie}>{data.movie}</span>
    </span>
  );
};

export default {
  dataSource: dataSource,
  renderer: renderer,
  count: actors.length,
};
