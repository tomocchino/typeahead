import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import states from "../src/examples/states/data";

let dataSource = new DataSource();
dataSource.addEntries(
  states.map((entry) => {
    return new DataSourceEntry(entry.text, entry.value);
  })
);

let renderer = (entry) => {
  return <span>{entry.getText()}</span>;
};

export default function States() {
  let numEntries = dataSource.getNumberOfEntries();
  return (
    <Template title="State Search">
      <Typeahead
        placeholder={`${numEntries.toLocaleString()} states`}
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
