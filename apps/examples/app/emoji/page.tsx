"use client";

import { DataSource, DataSourceEntry, Typeahead } from "@tomocchino/typeahead";
import { useEffect, useMemo } from "react";
import {
  Emoji,
  fetchFromCDN,
  flattenEmojiData,
  fromHexcodeToCodepoint,
  fromCodepointToUnicode,
} from "emojibase";
import styles from "./styles.module.css";
import examplesClassNames from "@/styles/examplesClassNames";

function initEmojiDataSource(dataSource: DataSource, data: Array<Emoji>) {
  dataSource.addEntries(
    flattenEmojiData(data)
      .sort((a, b) => {
        let aName = a.label.toLowerCase();
        let bName = b.label.toLowerCase();
        return aName < bName ? -1 : aName > bName ? 1 : 0;
      })
      .map((entry) => {
        return new DataSourceEntry(
          entry.label.replace("flag: ", "").replace(/-/g, " "),
          fromCodepointToUnicode(fromHexcodeToCodepoint(entry.hexcode)),
          { keywords: entry.tags }
        );
      })
  );
}

function renderer(entry: DataSourceEntry) {
  return (
    <span className={styles.Emoji_row}>
      <span className={styles.Emoji_glyph}>{entry.getValue()}</span>
      <span className={styles.Emoji_meta}>
        <span className={styles.Emoji_text}>{entry.getText()}</span>
        <span className={styles.Emoji_keywords}>
          keywords: {entry.getKeywords().join(", ")}
        </span>
      </span>
    </span>
  );
}

function onSelect(entry: DataSourceEntry) {
  let value = entry.getValue();
  navigator.clipboard.writeText(value);
  return value;
}

export default function EmojiExample() {
  let dataSource = useMemo(() => {
    let dataSource = new DataSource();
    dataSource.setMaxResults(8);
    return dataSource;
  }, []);

  // wrapped in useEffect so Next doesn't execute on the server
  useEffect(() => {
    fetchFromCDN("en/compact.json").then((data) => {
      initEmojiDataSource(dataSource, data as Array<Emoji>);
    });
  }, [dataSource]);

  return (
    <Typeahead
      renderer={renderer}
      dataSource={dataSource}
      classNames={examplesClassNames}
      placeholder="Emoji Search (Emojibase)"
      showHintText={true}
      onSelect={onSelect}
    />
  );
}
