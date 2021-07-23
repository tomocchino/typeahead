import { useEffect } from "react";
import Template from "../src/examples/Template";
import Typeahead from "../src/modules/Typeahead";
import DataSource from "../src/modules/DataSource";
import DataSourceEntry from "../src/modules/DataSourceEntry";
import {
  fetchFromCDN,
  flattenEmojiData,
  fromHexcodeToCodepoint,
  fromCodepointToUnicode,
} from "emojibase";

import styles from "../src/examples/emoji/styles.module.css";

function initEmojiDataSource(dataSource, data) {
  dataSource.addEntries(
    flattenEmojiData(data)
      .sort((a, b) => {
        let aName = a.annotation.toLowerCase();
        let bName = b.annotation.toLowerCase();
        return aName < bName ? -1 : aName > bName ? 1 : 0;
      })
      .map((entry) => {
        return new DataSourceEntry(
          entry.annotation.replace("flag: ", "").replace(/-/g, " "),
          fromCodepointToUnicode(fromHexcodeToCodepoint(entry.hexcode)),
          { tags: entry.tags }
        );
      })
  );
}

function renderer(entry) {
  return (
    <span className={styles.Emoji_row}>
      <span className={styles.Emoji_glyph}>{entry.getValue()}</span>
      <span className={styles.Emoji_meta}>
        <span className={styles.Emoji_text}>{entry.getText()}</span>
        <span className={styles.Emoji_tags}>
          keywords: {entry.getRawData().tags.join(", ")}
        </span>
      </span>
    </span>
  );
}

function onSelect(entry, input) {
  input.value = entry.getValue();
  input.select();
  document.execCommand("copy");
  window.getSelection().collapseToEnd();
}

export default function Emoji() {
  let dataSource = new DataSource();
  dataSource.setMaxResults(8);

  // wrapped in useEffect so Next doesn't execute on the server
  useEffect(() => {
    fetchFromCDN("en/compact.json", "6.1.0").then((data) => {
      initEmojiDataSource(dataSource, data);
    });
  }, []);

  return (
    <Template title="Emoji Search">
      <Typeahead
        placeholder="Emoji Search (Emojibase)"
        dataSource={dataSource}
        renderer={renderer}
        onSelect={onSelect}
      />
    </Template>
  );
}
