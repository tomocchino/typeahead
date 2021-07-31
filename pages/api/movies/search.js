const API_KEY = process.env.API_KEY;

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

export default async function handler(request, response) {
  let url = new URL(request.url, `https://${request.headers.host}`);
  let query = url.searchParams.get("query");
  try {
    let data = await fetch(getSearchPath(query));
    let json = await data.json();
    response.status(200).json(json);
  } catch (error) {
    response.status(500).send(error);
  }
}
