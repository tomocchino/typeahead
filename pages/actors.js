import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Header from "../src/sections/Header";
import Typeahead from "../src/modules/Typeahead";

import styles from "../styles/App.module.css";
import actorStyles from "../src/examples/actorsStyles.module.css";

import actors from "../src/examples/actorsData";

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
      <span className={actorStyles.name}>{data.name}</span>
      <span className={actorStyles.movie}>{data.movie}</span>
    </span>
  );
};

export default function Actors() {
  return (
    <>
      <Header title="Simple Typeahead Example - Actors" />
      <div className={styles.App}>
        <Typeahead
          placeholder={`${actors.length} actors`}
          dataSource={dataSource}
          renderer={renderer}
        />
      </div>
    </>
  );
}
