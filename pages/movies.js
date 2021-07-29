import { useState } from "react";
import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import styles from "../src/examples/movies/styles.module.css";
import API_KEY from "../src/examples/movies/API_KEY.js";

import topMovies from "../src/examples/movies/data";
import tmdbConfig from "../src/examples/movies/config";

// Utilities

function createDataSourceEntry(data) {
  return new DataSourceEntry(data.title, data.id, data);
}

function getImagePath(path, sizeIndex) {
  let baseURL = tmdbConfig.images.base_url;
  let size = tmdbConfig.images.poster_sizes[sizeIndex || 0];
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

// Create DataSource

let dataSource = new DataSource();
dataSource.setMaxResults(6);
dataSource.setQueryHandler(searchForMovies);
dataSource.addEntries(topMovies.map(createDataSourceEntry));

// Typeahead Entry Renderer

let renderer = (movie) => {
  let data = movie.getRawData();
  let date = data.release_date;
  let year = date ? new Date(date).getFullYear() : "unknown";
  let poster = data.poster_path ? (
    <img src={getImagePath(data.poster_path)} />
  ) : null;
  return (
    <span className={styles.Entry}>
      <span className={styles.Entry_poster}>{poster}</span>
      <span className={styles.Entry_text}>
        <span className={styles.Entry_title}>{data.title}</span>
        <span className={styles.Entry_year}>{year}</span>
      </span>
    </span>
  );
};

// Movie Details Panel

function MovieDetails(props) {
  let movie = props.movie;
  let data = movie.getRawData();
  let date = data.release_date;
  let year = date ? new Date(date).getFullYear() : "unknown";
  return (
    <div className={styles.Details}>
      <div>
        <div className={styles.Details_poster}>
          {data.poster_path ? (
            <img src={getImagePath(data.poster_path, 2)} />
          ) : null}
        </div>
      </div>
      <div className={styles.Details_info}>
        <div className={styles.Details_title}>
          {data.title} <span className={styles.Details_year}>({year})</span>
        </div>
        {data.overview ? (
          <p className={styles.Details_overview}>{data.overview}</p>
        ) : null}
        {data.vote_average ? (
          <p className={styles.Details_rating}>Score: {data.vote_average}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function Movies() {
  let [movie, setMovie] = useState(null);

  let onSelect = function (entry) {
    setMovie(entry);
  };

  let onReset = function () {
    setMovie(null);
  };

  return (
    <Template title="Movie Search">
      <Typeahead
        placeholder="Movie Search (TMDB)"
        dataSource={dataSource}
        renderer={renderer}
        onSelect={onSelect}
        onReset={onReset}
      />
      <div>{movie ? <MovieDetails movie={movie} /> : null}</div>
    </Template>
  );
}
