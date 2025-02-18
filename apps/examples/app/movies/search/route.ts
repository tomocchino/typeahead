import { type NextRequest } from "next/server";

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

export async function GET(request: NextRequest) {
  if (typeof request.url === "string") {
    let searchParams = request.nextUrl.searchParams;
    let query = searchParams.get("query") || "";
    try {
      let data = await fetch(getSearchPath(query), getOptions());
      return new Response(data.body, { status: 200 });
    } catch (error) {
      return new Response("Error", { status: 500 });
    }
  }
}
