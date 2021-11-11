import React, { useEffect, useRef, useState } from "react";
import flatten from "../util/flatten";
import DataSource from "./DataSource";
import DataSourceEntry from "./DataSourceEntry";

const fallbackRenderer = (result: DataSourceEntry) => result.getText();
const fallbackDataSource = new DataSource();

type TypeaheadProps = {
  dataSource?: DataSource;
  placeholder?: string;
  showHintText?: boolean;
  classNames?: {
    input?: string;
    result?: string;
    wrapper?: string;
    hintText?: string;
    resultList?: string;
    inputSelected?: string;
    resultHighlighted?: string;
  };
  onReset?: () => void;
  onSelect?: (result: DataSourceEntry) => string | void;
  renderer?: (result: DataSourceEntry) => React.ReactNode;
};

export default function Typeahead(props: TypeaheadProps) {
  let [results, setResults] = useState<Array<DataSourceEntry>>([]);
  let [selected, setSelected] = useState<DataSourceEntry | null>(null);
  let [highlightedIndex, setHighlightedIndex] = useState(-1);

  const renderer = props.renderer || fallbackRenderer;
  const classNames = props.classNames || {};
  const showHintText = props.showHintText || false;
  const dataSource = props.dataSource || fallbackDataSource;
  const resultList = useRef<HTMLUListElement>(null);
  const input = useRef<HTMLInputElement>(null);

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
    setSelected(null);
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
    if (resultList.current && target !== resultList.current) {
      let node = target.closest(".Typeahead_result");
      if (node) {
        let index = Array.from(resultList.current.childNodes).indexOf(node);
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

  let handleSelection = (result: DataSourceEntry) => {
    if (!result) {
      return;
    }
    // allow onSelect to change the value of the input as in the emoji example
    if (input.current) {
      let value = props.onSelect && props.onSelect(result);
      input.current.value = value || result.getText();
      setSelected(result);
      setResults([]);
    }
  };

  useEffect(() => {
    dataSource.setQueryCallback(handleResponse);
    return () => dataSource.setQueryCallback(null);
  }, [dataSource]);

  let inputClassName = cx("Typeahead_input", classNames.input);
  let wrapperClassName = cx("Typeahead_wrapper", classNames.wrapper);
  let hintTextClassName = cx("Typeahead_hintText", classNames.hintText);
  let resultListClassName = cx("Typeahead_resultList", classNames.resultList);

  if (selected !== null) {
    inputClassName += cx(" selected", classNames.inputSelected);
  }

  let hintText = "";
  if (showHintText) {
    let highlightedResult = results[highlightedIndex];
    if (highlightedResult && input.current) {
      let value = input.current.value;
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
          className={hintTextClassName}
          placeholder={hintText}
        />
      ) : null}
      <input
        ref={input}
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
          ref={resultList}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={resultListClassName}>
          {results.map((result, index) => {
            let resultClassName = cx("Typeahead_result", classNames.result);
            if (index === highlightedIndex) {
              resultClassName += cx(
                " highlighted",
                classNames.resultHighlighted
              );
            }
            return (
              <li className={resultClassName} key={result.getValue()}>
                {renderer(result)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Helper function to make the following pattern more concise
// ```
// let exampleClassName = "Typeahead_example";
// if (classNames.example) {
//   exampleClassName += " " + classNames.example;
// }
// ```
function cx(a?: string, b?: string) {
  return (a || "") + (b ? " " + b : "");
}
