import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

function makeString(length) {
  var string = "";
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz     ";
  for (var ii = 0; ii < length; ii++) {
    string += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return string;
}

let entries = [];
for (let ii = 0; ii < 100000; ii++) {
  entries.push(makeString(10));
}

let dataSource = new DataSource();
dataSource.addEntries(
  entries.map((entry) => {
    return new DataSourceEntry(entry);
  })
);

let renderer = (entry) => {
  return <span>{entry.getText()}</span>;
};

export default function Strings() {
  return (
    <Template title="Random Strings Typeahead">
      <Typeahead
        placeholder={`${dataSource.getNumberOfEntries()} strings`}
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
