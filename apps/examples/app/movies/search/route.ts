function getSearchPath(query: string) {
  let params = new URLSearchParams({
    page: "1",
    language: "en-US",
    include_adult: "false",
    query: query,
  });

  return "https://api.themoviedb.org/3/search/movie?" + params.toString();
}

function getOptions() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.ACCESS_TOKEN || "",
    },
  };
  return options;
}

export async function GET(request: Request) {
  if (typeof request.url === "string") {
    let url = new URL(request.url, `https://${request.headers.host}`);
    let query = url.searchParams.get("query") ?? "";
    try {
      let data = await fetch(getSearchPath(query), getOptions());
      return new Response(data.body, { status: 200 });
    } catch (error) {
      return new Response("Error", { status: 500 });
    }
  }
}
