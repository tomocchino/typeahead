import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

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

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (typeof request.url === "string") {
    let url = new URL(request.url, `https://${request.headers.host}`);
    let query = url.searchParams.get("query") ?? "";
    let options = getOptions();
    try {
      let data = await fetch(getSearchPath(query), options);
      response.status(200).send(data.body);
    } catch (error) {
      response.status(500).send(error);
    }
  }
}
