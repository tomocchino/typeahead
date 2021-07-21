import { useState } from "react";
import Head from "next/head";
import Nav from "../src/modules/Nav";
import Typeahead from "../src/modules/Typeahead";
import actorsConfig from "../src/examples/actorsConfig";
import citiesConfig from "../src/examples/citiesConfig";
import statesConfig from "../src/examples/statesConfig";

import styles from "../styles/App.module.css";

const CONFIG = {
  actors: actorsConfig,
  cities: citiesConfig,
  states: statesConfig,
};

export default function Examples() {
  let [type, setType] = useState("actors");
  let config = CONFIG[type];
  let handleChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>Simple Typeahead Examples</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className={styles.App}>
        <Typeahead
          placeholder={`${config.count} ${type}`}
          key={type}
          dataSource={config.dataSource}
          renderer={config.renderer}
          onSelect={config.action}
        />
        <div>
          <select className={styles.Select} onChange={handleChange}>
            <option value="actors">Actors</option>
            <option value="cities">Cities</option>
            <option value="states">States</option>
          </select>
        </div>
      </div>
    </div>
  );
}
