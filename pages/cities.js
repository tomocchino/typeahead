import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import cities from "../src/examples/cities/data";

let dataSource = new DataSource();
dataSource.setMaxResults(15);
dataSource.addEntries(cities.map((text) => new DataSourceEntry(text)));

let renderer = (entry) => {
  return <span>{entry.getText()}</span>;
};

export default function Cities() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Template title="City Search">
      <Typeahead
        placeholder={`${numEntries.toLocaleString()} cities`}
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
