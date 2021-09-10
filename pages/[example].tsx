import React from "react";
import dynamic from "next/dynamic";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/examples.module.css";

const PATHS = {
  states: dynamic(() => import("../examples/states")),
  actors: dynamic(() => import("../examples/actors")),
  cities: dynamic(() => import("../examples/cities")),
  strings: dynamic(() => import("../examples/strings")),
  emoji: dynamic(() => import("../examples/emoji")),
  movies: dynamic(() => import("../examples/movies")),
};

function Empty() {
  return null;
}

export default function Index() {
  let example = useRouter().query.example;
  let Example: React.ComponentType;
  if (typeof example !== "string" || !example) {
    Example = Empty;
  } else if (PATHS[example]) {
    Example = PATHS[example];
  } else {
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
      <div className={styles.Main}>
        <Example />
      </div>
    </>
  );
}
