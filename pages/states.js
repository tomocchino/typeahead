import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import states from "../src/examples/statesData";

let dataSource = new DataSource();
dataSource.addEntries(
  states.map((entry) => {
    return new DataSourceEntry(entry.text, entry.value);
  })
);

let renderer = (entry) => {
  return <span>{entry._text}</span>;
};

export default function States() {
  return (
    <Template title="States Typeahead">
      <Typeahead
        placeholder={`${states.length} states`}
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
