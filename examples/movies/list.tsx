import { DataSource, DataSourceEntry, Typeahead } from "../../src";
import { useState } from "react";
import topMovies from "./data";
import tmdbConfig from "./config";
import styles from "./styles.module.css";

// Utilities

function createDataSourceEntry(data: any) {
  return new DataSourceEntry(data.title, data.id + "", data);
}

function getImagePath(path: string, sizeIndex: number = 0) {
  let baseURL = tmdbConfig.images.secure_base_url;
  let size = tmdbConfig.images.poster_sizes[sizeIndex];
  return baseURL + size + path;
}

function getSearchPath(query: string) {
  let origin = window.location.origin;
  let path = "/api/movies/search?query=";
  return origin + path + encodeURIComponent(query);
}

async function searchForMovies(value: string) {
  try {
    console.log("GOING TO THE NETWORK FOR", value);
    let data = await fetch(getSearchPath(value));
    let json = await data.json();
    dataSource.addEntries(json.results.map(createDataSourceEntry));
  } catch (error) {
    console.error(error);
  }
}

// Create DataSource

let dataSource = new DataSource();
dataSource.setMaxResults(6);
dataSource.setQueryHandler(searchForMovies);
dataSource.addEntries(topMovies.map(createDataSourceEntry));

// Typeahead Entry Renderer

let renderer = (movie: DataSourceEntry) => {
  let data = movie.getRawData() ?? {};
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

// Selected Movies List
function MoviesList(props: { movies: Array<DataSourceEntry> }) {
  return (
    <ul className={styles.List}>
      {props.movies.map((movie) => {
        let data = movie.getRawData() ?? {};
        let date = data.release_date;
        let year = date ? new Date(date).getFullYear() : "unknown";
        return (
          <li key={movie.getValue()}>
            <div className={styles.List_item}>
              <div>
                <div className={styles.List_poster}>
                  {data.poster_path ? (
                    <img src={getImagePath(data.poster_path, 2)} />
                  ) : null}
                </div>
              </div>
              <div className={styles.List_info}>
                <div className={styles.List_title}>
                  {data.title}{" "}
                  <span className={styles.List_year}>({year})</span>
                </div>
                {data.vote_average ? (
                  <p className={styles.List_score}>
                    Score: {data.vote_average}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function MoviesExample() {
  let [movies, setMovies] = useState<Array<DataSourceEntry>>([]);

  let onSelect = function (entry: DataSourceEntry) {
    if (!movies.includes(entry)) {
      setMovies(movies.concat(entry));
    }
    return "";
  };

  let clearMovies = function () {
    setMovies([]);
  };

  return (
    <div>
      <div>{movies.length ? <MoviesList movies={movies} /> : null}</div>
      <div className={styles.Container}>
        <Typeahead
          renderer={renderer}
          dataSource={dataSource}
          placeholder="Movie Search (TMDB)"
          showHintText={true}
          onSelect={onSelect}
        />
        {movies.length ? (
          <input
            type="button"
            value="clear"
            className={styles.List_clear}
            onClick={clearMovies}
          />
        ) : null}
      </div>
    </div>
  );
}
