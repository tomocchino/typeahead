import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import API_KEY from "../src/examples/movies/API_KEY.js";
console.log(API_KEY);

const movies = ["Avengers", "Iron Man", "Thor"];

let dataSource = new DataSource();
dataSource.addEntries(
  movies.map((entry) => {
    return new DataSourceEntry(entry);
  })
);

let renderer = (entry) => {
  return <span>{entry.getText()}</span>;
};

export default function Movies() {
  return (
    <Template title="Movies Typeahead">
      <Typeahead
        placeholder="Search TMDB Movies"
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
