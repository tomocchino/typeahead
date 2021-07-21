import Head from "next/head";
import Nav from "../src/modules/Nav";
import EmojiTypeahead from "../src/examples/EmojiTypeahead";

import styles from "../styles/App.module.css";

export default function Emoji() {
  return (
    <div>
      <Head>
        <title>Emoji Typeahead Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className={styles.App}>
        <EmojiTypeahead />
      </div>
    </div>
  );
}
