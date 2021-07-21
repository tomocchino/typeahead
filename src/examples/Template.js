import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

import styles from "../../styles/App.module.css";

let pages = ["emoji", "actors"];

function Nav() {
  let router = useRouter();
  let currentPath = router.pathname.slice(1);
  let links = pages.map((path) => {
    let className = currentPath === path ? styles.Selected : "";
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

export default function Template(props) {
  return (
    <div>
      <Head>
        <title>{props.title || "Typeahead"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className={styles.App}>{props.children}</div>
    </div>
  );
}
