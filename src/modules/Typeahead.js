import { useEffect, useRef, useState } from "react";
import Keys from "../util/Keys";
import styles from "./Typeahead.module.css";

export default function Typeahead(props) {
  let [results, setResults] = useState([]);
  let [selectedEntry, setSelectedEntry] = useState(null);
  let [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dataSource = props.dataSource;
  const textInput = useRef(null);

  let handleResponse = (value, results) => {
    // results is a list of DataSourceEntry items
    setResults(results);
    setHighlightedIndex(0);
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

  let handleClick = (event) => {
    let numResults = results.length;
    if (numResults === 0) {
      return;
    }

    let index = highlightedIndex;
    handleSelection(results[index]);
  };

  let handleKeydown = (event) => {
    let numResults = results.length;
    if (numResults === 0) {
      return;
    }

    let index = highlightedIndex;
    switch (event.keyCode) {
      case Keys.down:
        index++;
        if (index > numResults - 1) {
          index = 0;
        }
        setHighlightedIndex(index);
        event.preventDefault();
        break;
      case Keys.up:
        index--;
        if (index < 0) {
          index = numResults - 1;
        }
        setHighlightedIndex(index);
        event.preventDefault();
        break;
      case Keys.enter:
        handleSelection(results[index]);
        break;
      default:
        break;
    }
  };

  let handleMouseMove = (event) => {
    let node = event.target;
    let index = Array.from(node.parentNode.childNodes).indexOf(node);
    setHighlightedIndex(index);
  };

  let handleMouseLeave = (event) => {
    setHighlightedIndex(-1);
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
    // allow onSelect to change the value of the input
    if (input.value === inputValue) {
      input.value = entry.getText();
    }
    setSelectedEntry(entry);
    setResults([]);
  };

  useEffect(() => {
    dataSource.setQueryCallback(handleResponse);
    return function cleanup() {
      dataSource.setQueryCallback(null);
    };
  }, [dataSource]);

  let inputClassName = styles.Typeahead_input;
  if (selectedEntry !== null) {
    inputClassName += ` ${styles.selected}`;
  }

  return (
    <div className={styles.Typeahead_root}>
      <input
        ref={textInput}
        autoFocus
        type="text"
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder={props.placeholder || "Search"}
        className={inputClassName}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={handleKeydown}
      />
      {results.length > 0 ? (
        <ul
          className={styles.Typeahead_results}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}>
          {results.map((entry, index) => {
            let entryClassName = styles.Typeahead_result;
            if (index === highlightedIndex) {
              entryClassName += ` ${styles.highlighted}`;
            }
            return (
              <li className={entryClassName} key={entry.getValue()}>
                {props.renderer(entry)}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
