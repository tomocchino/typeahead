import Head from "next/head";
import EmojiTypeahead from "../src/examples/EmojiTypeahead";

import styles from "../styles/App.module.css";

export default function Emoji() {
  return (
    <div>
      <Head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.App}>
        <EmojiTypeahead />
      </div>
    </div>
  );
}
