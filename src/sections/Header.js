import Head from "next/head";
import Nav from "./Nav";

import styles from "../../styles/App.module.css";

export default function Header(props) {
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
