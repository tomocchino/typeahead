import { DataSource, DataSourceEntry, Typeahead } from "../../src";
import actors from "./data";
import styles from "./styles.module.css";
import examplesClassNames from "../../styles/examplesClassNames";

let dataSource = new DataSource();
dataSource.addEntries(
  actors.map((entry) => {
    return new DataSourceEntry(entry.name, entry.id, entry);
  })
);

let renderer = (entry: DataSourceEntry) => {
  let data = entry.getRawData() ?? {};
  return (
    <span>
      <span className={styles.Name}>{data.name ?? "<unknown>"}</span>
      <span className={styles.Movie}>{data.movie ?? "<unknown>"}</span>
    </span>
  );
};

export default function ActorsExample() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Typeahead
      renderer={renderer}
      dataSource={dataSource}
      classNames={examplesClassNames}
      placeholder={`${numEntries.toLocaleString()} actors`}
      showHintText={true}
    />
  );
}
