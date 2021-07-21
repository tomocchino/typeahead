import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import actors from "../src/examples/actorsData";
import styles from "../src/examples/actorsStyles.module.css";

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

export default function Actors() {
  return (
    <Template title="Actors Typeahead">
      <Typeahead
        placeholder={`${actors.length} actors`}
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
