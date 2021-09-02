import React, { useEffect, useRef, useState } from "react";
import flatten from "../util/flatten";
import DataSource from "./DataSource";
import DataSourceEntry from "./DataSourceEntry";
import styles from "./Typeahead.module.css";

const fallbackRenderer = (entry: DataSourceEntry) => entry.getText();
const fallbackDataSource = new DataSource();

type TypeaheadProps = {
  dataSource?: DataSource;
  onReset?: () => void;
  onSelect?: (entry: DataSourceEntry) => string | void;
  placeholder?: string;
  renderer?: (entry: DataSourceEntry) => React.ReactNode;
};

export default function Typeahead(props: TypeaheadProps) {
  let [results, setResults] = useState([]);
  let [selectedEntry, setSelectedEntry] = useState(null);
  let [highlightedIndex, setHighlightedIndex] = useState(-1);

  const renderer = props.renderer || fallbackRenderer;
  const dataSource = props.dataSource || fallbackDataSource;
  const textInput = useRef(null);
  const resultsList = useRef(null);

  let handleClick = () => {
    let numResults = results.length;
    if (numResults === 0) {
      return;
    }
    let index = highlightedIndex;
    handleSelection(results[index]);
  };

  let handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  let handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    dataSource.query(value);
    setSelectedEntry(null);
    if (props.onReset) {
      props.onReset();
    }
  };

  let handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    let numResults = results.length;
    if (numResults === 0) {
      return;
    }
    let index = highlightedIndex;
    switch (event.key) {
      case "ArrowDown":
        if (++index > numResults - 1) {
          index = 0;
        }
        setHighlightedIndex(index);
        event.preventDefault();
        break;
      case "ArrowUp":
        if (--index < 0) {
          index = numResults - 1;
        }
        setHighlightedIndex(index);
        event.preventDefault();
        break;
      case "Tab":
      case "Enter":
        handleSelection(results[index]);
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  let handleMouseLeave = () => {
    setHighlightedIndex(-1);
  };

  let handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    let target = event.target as HTMLElement;
    if (target !== resultsList.current) {
      let node = target.closest(`.${styles.Typeahead_result}`);
      let index = Array.from(resultsList.current.childNodes).indexOf(node);
      if (index != highlightedIndex) {
        setHighlightedIndex(index);
      }
    }
  };

  let handleResponse = (value: string, results: Array<DataSourceEntry>) => {
    setResults(results);
    setHighlightedIndex(0);
  };

  let handleSelection = (entry: DataSourceEntry) => {
    if (!entry) {
      return;
    }
    // allow onSelect to change the value of the input as in the emoji example
    let value = props.onSelect && props.onSelect(entry);
    textInput.current.value = value || entry.getText();
    setSelectedEntry(entry);
    setResults([]);
  };

  useEffect(() => {
    dataSource.setQueryCallback(handleResponse);
    return () => dataSource.setQueryCallback(null);
  }, [dataSource]);

  let inputClassName = styles.Typeahead_input;
  if (selectedEntry !== null) {
    inputClassName += ` ${styles.selected}`;
  }

  let suggestedText = "";
  let highlightedResult = results[highlightedIndex];
  if (highlightedResult && textInput.current) {
    let value = textInput.current.value;
    let highlightedResultText = highlightedResult.getText();
    if (flatten(highlightedResultText).startsWith(flatten(value))) {
      suggestedText =
        value.substring(0, value.length) +
        highlightedResultText.substring(value.length);
    }
  }

  return (
    <div className={styles.Typeahead_root}>
      <input
        disabled
        type="text"
        placeholder={suggestedText}
        className={styles.Typeahead_suggestedText}
      />
      <input
        ref={textInput}
        type="text"
        autoFocus
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder={props.placeholder || "Search"}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={handleKeydown}
        className={inputClassName}
      />
      {results.length === 0 ? null : (
        <ul
          ref={resultsList}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={styles.Typeahead_results}>
          {results.map((entry, index) => {
            let entryClassName = styles.Typeahead_result;
            if (index === highlightedIndex) {
              entryClassName += ` ${styles.highlighted}`;
            }
            return (
              <li className={entryClassName} key={entry.getValue()}>
                {renderer(entry)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
