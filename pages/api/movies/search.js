function getSearchPath(query) {
  let params = new URLSearchParams({
    page: 1,
    langauge: "un-US",
    include_adult: false,
    api_key: process.env.API_KEY,
    query: query,
  });

  return "https://api.themoviedb.org/3/search/movie?" + params.toString();
}

export default async function handler(request, response) {
  let url = new URL(request.url, `https://${request.headers.host}`);
  let query = url.searchParams.get("query");
  try {
    let data = await fetch(getSearchPath(query));
    response.status(200).send(data.body);
  } catch (error) {
    response.status(500).send(error);
  }
}
