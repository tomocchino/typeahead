import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import cities from "../src/examples/citiesData";

let dataSource = new DataSource();
dataSource.setMaxResults(15);
dataSource.addEntries(cities.map((text) => new DataSourceEntry(text)));

let renderer = (entry) => {
  return <span>{entry._text}</span>;
};

export default function Cities() {
  return (
    <Template title="Cities Typeahead">
      <Typeahead
        placeholder={`${cities.length} cities`}
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
