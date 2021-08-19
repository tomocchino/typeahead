import dynamic from "next/dynamic";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/examples.module.css";

const PATHS = {
  states: dynamic(() => import("/examples/states")),
  actors: dynamic(() => import("/examples/actors")),
  cities: dynamic(() => import("/examples/cities")),
  strings: dynamic(() => import("/examples/strings")),
  emoji: dynamic(() => import("/examples/emoji")),
  movies: dynamic(() => import("/examples/movies")),
};

export default function Index() {
  let { example } = useRouter().query;
  let Example = PATHS[example];
  if (example && !Example) {
    return <Error statusCode={404} />;
  }

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
    <>
      <nav className={styles.Nav}>
        <ul>{links}</ul>
      </nav>
      <div className={styles.Main}>{Example ? <Example /> : null}</div>
    </>
  );
}
