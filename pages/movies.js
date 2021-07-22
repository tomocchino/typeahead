import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";

import topMovies from "../src/examples/movies/data";
import API_KEY from "../src/examples/movies/API_KEY.js";

let dataSource = new DataSource();
dataSource.addEntries(
  topMovies.map((entry) => {
    return new DataSourceEntry(entry.title, entry.title, entry);
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
      dataSource.addEntries(
        data.results.map((entry) => {
          // `results` has: {
          //   adult: false
          //   backdrop_path: "/cGUxPXVZF5n5P09dnlhWC8bLVp7.jpg"
          //   genre_ids: [18, 53]
          //   id: 505225
          //   original_language: "en"
          //   original_title: "The Last Thing He Wanted"
          //   overview: "At the turning point of the Iran-Contra affair, Elena McMahon…"
          //   popularity: 106.201
          //   poster_path: "/gItrnbEbMBbUrdIkFz8kgS2gkt.jpg"
          //   release_date: "2020-02-14"
          //   title: "The Last Thing He Wanted"
          //   video: false
          //   vote_average: 5
          //   vote_count: 342
          // }
          return new DataSourceEntry(entry.title, entry.title, {
            rating: null,
            review_count: entry.vote_count,
            title: entry.title,
          });
        })
      );
    });
});

let renderer = (entry) => {
  return <span>{entry.getText()}</span>;
};

export default function Movies() {
  return (
    <Template title="Movies Typeahead">
      <Typeahead
        placeholder="Search Movies"
        dataSource={dataSource}
        renderer={renderer}
      />
    </Template>
  );
}
