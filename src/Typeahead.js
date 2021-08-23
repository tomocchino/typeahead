import { useEffect, useRef, useState } from "react";
import DataSource from "./DataSource";
import Keys from "./Keys";
import styles from "./Typeahead.module.css";

const fallbackRenderer = (entry) => entry.getText();
const fallbackDataSource = new DataSource();

export default function Typeahead(props) {
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

  let handleFocus = (event) => {
    event.target.select();
  };

  let handleInput = (event) => {
    let value = event.target.value;
    dataSource.query(value);
    setSelectedEntry(null);
    if (props.onReset) {
      props.onReset();
    }
  };

  let handleKeydown = (event) => {
    let numResults = results.length;
    if (numResults === 0) {
      return;
    }
    let index = highlightedIndex;
    switch (event.keyCode) {
      case Keys.down:
        if (++index > numResults - 1) {
          index = 0;
        }
        setHighlightedIndex(index);
        event.preventDefault();
        break;
      case Keys.up:
        if (--index < 0) {
          index = numResults - 1;
        }
        setHighlightedIndex(index);
        event.preventDefault();
        break;
      case Keys.tab:
      case Keys.enter:
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

  let handleMouseMove = (event) => {
    let target = event.target;
    if (target !== resultsList.current) {
      let node = target.closest(`.${styles.Typeahead_result}`);
      let index = Array.from(resultsList.current.childNodes).indexOf(node);
      if (index != highlightedIndex) {
        setHighlightedIndex(index);
      }
    }
  };

  let handleResponse = (value, results) => {
    // results is a list of DataSourceEntry items
    setResults(results);
    setHighlightedIndex(0);
  };

  let handleSelection = (entry) => {
    if (!entry) {
      return;
    }
    let input = textInput.current;
    let inputValue = input.value;
    if (props.onSelect) {
      props.onSelect(entry, input);
    }
    // allow onSelect to change the value of the input as in the emoji example
    if (input.value === inputValue) {
      input.value = entry.getText();
    }
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

  return (
    <div className={styles.Typeahead_root}>
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
