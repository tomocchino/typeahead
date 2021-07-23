import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import actors from "../src/examples/actors/data";
import styles from "../src/examples/actors/styles.module.css";

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
    <Template title="Actor Search">
      <Typeahead
        placeholder={`${numEntries.toLocaleString()} actors`}
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
