import React, { useEffect, useRef, useState } from "react";
import flatten from "../util/flatten";
import DataSource from "./DataSource";
import DataSourceEntry from "./DataSourceEntry";

const fallbackRenderer = (entry: DataSourceEntry) => entry.getText();
const fallbackDataSource = new DataSource();

type TypeaheadProps = {
  dataSource?: DataSource;
  placeholder?: string;
  showHintText?: boolean;
  wrapperClassName?: string;
  hintTextClassName?: string;
  textInputClassName?: string;
  resultListClassName?: string;
  onReset?: () => void;
  onSelect?: (entry: DataSourceEntry) => string | void;
  renderer?: (entry: DataSourceEntry) => React.ReactNode;
};

export default function Typeahead(props: TypeaheadProps) {
  let [results, setResults] = useState<Array<DataSourceEntry>>([]);
  let [selectedEntry, setSelectedEntry] = useState<DataSourceEntry | null>(
    null
  );
  let [highlightedIndex, setHighlightedIndex] = useState(-1);

  const renderer = props.renderer || fallbackRenderer;
  const showHintText = props.showHintText || false;
  const dataSource = props.dataSource || fallbackDataSource;
  const textInput = useRef<HTMLInputElement>(null);
  const resultsList = useRef<HTMLUListElement>(null);

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
    if (resultsList.current && target !== resultsList.current) {
      let node = target.closest(".Typeahead_result");
      if (node) {
        let index = Array.from(resultsList.current.childNodes).indexOf(node);
        if (index != highlightedIndex) {
          setHighlightedIndex(index);
        }
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
    if (textInput.current) {
      let value = props.onSelect && props.onSelect(entry);
      textInput.current.value = value || entry.getText();
      setSelectedEntry(entry);
      setResults([]);
    }
  };

  useEffect(() => {
    dataSource.setQueryCallback(handleResponse);
    return () => dataSource.setQueryCallback(null);
  }, [dataSource]);

  let wrapperClassName = "Typeahead_wrapper";
  if (props.wrapperClassName) {
    wrapperClassName += " " + props.wrapperClassName;
  }

  let hintTextClassName = "Typeahead_hintText";
  if (props.hintTextClassName) {
    hintTextClassName += " " + props.hintTextClassName;
  }

  let textInputClassName = "Typeahead_textInput";
  if (props.textInputClassName) {
    textInputClassName += " " + props.textInputClassName;
  }

  let resultListClassName = "Typeahead_resultList";
  if (props.resultListClassName) {
    resultListClassName += " " + props.resultListClassName;
  }

  if (selectedEntry !== null) {
    textInputClassName += " selected";
  }

  let hintText = "";
  if (showHintText) {
    let highlightedResult = results[highlightedIndex];
    if (highlightedResult && textInput.current) {
      let value = textInput.current.value;
      let highlightedResultText = highlightedResult.getText();
      if (flatten(highlightedResultText).startsWith(flatten(value))) {
        hintText =
          value.substring(0, value.length) +
          highlightedResultText.substring(value.length);
      }
    }
  }

  return (
    <div className={wrapperClassName}>
      {showHintText ? (
        <input
          disabled
          type="text"
          placeholder={hintText}
          className={hintTextClassName}
        />
      ) : null}
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
        className={textInputClassName}
      />
      {results.length === 0 ? null : (
        <ul
          ref={resultsList}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={resultListClassName}>
          {results.map((entry, index) => {
            let entryClassName = "Typeahead_result";
            if (index === highlightedIndex) {
              entryClassName += " highlighted";
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
