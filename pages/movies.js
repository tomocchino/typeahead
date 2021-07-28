import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import styles from "../src/examples/movies/styles.module.css";
import API_KEY from "../src/examples/movies/API_KEY.js";

import topMovies from "../src/examples/movies/data";
import tmdbConfig from "../src/examples/movies/config";

function createDataSourceEntry(data) {
  return new DataSourceEntry(data.title, data.id, data);
}

function getImagePath(path) {
  let baseURL = tmdbConfig.images.base_url;
  let size = tmdbConfig.images.poster_sizes[0];
  return baseURL + size + path;
}

function getSearchPath(query) {
  let params = new URLSearchParams({
    page: 1,
    langauge: "un-US",
    include_adult: false,
    api_key: API_KEY,
    query: query,
  });
  return "https://api.themoviedb.org/3/search/movie?" + params.toString();
}

async function searchForMovies(value) {
  // don't hammer the network on single character input, or should we?
  if (value.length < 2) {
    return;
  }
  console.log("GOING TO THE NETWORK FOR", value);
  let response = await fetch(getSearchPath(value));
  let data = await response.json();
  let movies = data.results;
  dataSource.addEntries(movies.map(createDataSourceEntry));
}

let dataSource = new DataSource();
dataSource.setMaxResults(6);
dataSource.setQueryHandler(searchForMovies);
dataSource.addEntries(topMovies.map(createDataSourceEntry));

let renderer = (entry) => {
  let data = entry.getRawData();
  let date = data.release_date;
  let year = date ? new Date(data.release_date).getFullYear() : "unknown";
  let poster = data.poster_path ? (
    <img src={getImagePath(data.poster_path)} />
  ) : null;
  return (
    <span className={styles.Entry}>
      <span className={styles.Poster}>{poster}</span>
      <span className={styles.Text}>
        <span className={styles.Title}>{data.title}</span>
        <span className={styles.Year}>{year}</span>
      </span>
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
