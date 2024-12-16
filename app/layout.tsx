import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "../styles/globals.css";
import "../src/css/styles.css";

import styles from "../styles/examples.module.css";

const PATHS: { [key: string]: string } = {
  states: "states",
  actors: "actors",
  cities: "cities",
  strings: "strings",
  emoji: "emoji",
  movies: "movies",
  movielist: "movies/list",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let links = Object.keys(PATHS).map((path) => {
    // let className = example === path ? styles.selected : "";
    let value = PATHS[path];
    let className = "";
    return (
      <li key={path}>
        <Link className={className} href={"/" + value}>
          {path}
        </Link>
      </li>
    );
  });

  return (
    <html lang="en">
      <head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <nav className={styles.Nav}>
          <ul>{links}</ul>
        </nav>
        <div className={styles.Main}>{children}</div>
        <SpeedInsights />
      </body>
    </html>
  );
}
