import dynamic from "next/dynamic";
import Error from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/examples.module.css";

const PATHS = {
  states: dynamic(() => import("../src/examples/states")),
  actors: dynamic(() => import("../src/examples/actors")),
  cities: dynamic(() => import("../src/examples/cities")),
  strings: dynamic(() => import("../src/examples/strings")),
  emoji: dynamic(() => import("../src/examples/emoji")),
  movies: dynamic(() => import("../src/examples/movies")),
};

function Nav() {
  let { example } = useRouter().query;
  let links = Object.keys(PATHS).map((path) => {
    let className = example === path ? styles.selected : "";
    return (
      <li key={path}>
        <Link href={"/" + path}>
          <a className={className}>{path}</a>
        </Link>
      </li>
    );
  });

  return (
    <nav className={styles.Nav}>
      <ul>{links}</ul>
    </nav>
  );
}

export default function Index(props) {
  let { example } = useRouter().query;
  let Example = PATHS[example];
  if (example && !Example) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <Head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className={styles.Main}>{Example ? <Example /> : null}</div>
    </div>
  );
}
