import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import styles from "../src/examples/movies/styles.module.css";
import topMovies from "../src/examples/movies/data";
import API_KEY from "../src/examples/movies/API_KEY.js";

let dataSource = new DataSource();
dataSource.addEntries(
  topMovies.map((entry) => {
    return new DataSourceEntry(entry.title, entry.id, entry);
  })
);

dataSource.setQueryHandler((value) => {
  // don't hammer the network on single character input, or should we?
  if (value.length < 2) {
    return;
  }
  console.log("GOING TO THE NETWORK FOR", value);
  let query = encodeURIComponent(value);
  let url = `https://api.themoviedb.org/3/search/movie?language=en-US&page=1&include_adult=false&query=${query}&api_key=${API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // `data` has page, results, total_pages, total_results
      // check "../src/examples/movies/data" for shape of each `results` entry
      dataSource.addEntries(
        data.results.map((entry) => {
          return new DataSourceEntry(entry.title, entry.id, entry);
        })
      );
    });
});

let renderer = (entry) => {
  let data = entry.getRawData();
  let date = data.release_date;
  let year = date ? new Date(data.release_date).getFullYear() : "unknown";
  return (
    <span className={styles.Entry}>
      <span>{data.title}</span>
      <span className={styles.Year}>{year}</span>
    </span>
  );
};

export default function Movies() {
  return (
    <Template title="Movie Search">
      <Typeahead
        placeholder="Movie Search (TMDB)"
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
