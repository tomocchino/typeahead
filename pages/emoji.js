import Header from "../src/sections/Header";
import EmojiTypeahead from "../src/examples/EmojiTypeahead";

import styles from "../styles/App.module.css";

export default function Emoji() {
  return (
    <>
      <Header title="Emoji Typeahead Example" />
      <div className={styles.App}>
        <EmojiTypeahead />
      </div>
    </>
  );
}
