import React from "react";
import {Component} from "react";
import Keys from "../util/Keys";
import styles from "./Typeahead.module.css";

export default class Typeahead extends Component {
  constructor(props) {
    super(props);
    this.props.dataSource.setQueryCallback(this.handleResponse);
    this.state = {
      results: [],
      highlightedIndex: -1,
    };
  }

  handleResponse = (value, results) => {
    // results is a list of DataSourceEntry items
    this.setState({results: results, highlightedIndex: 0});
  };

  handleInput = (event) => {
    this.props.dataSource.query(event.target.value);
  };

  handleClick = (event) => {
    let numResults = this.state.results.length;
    if (numResults === 0) {
      return;
    }

    let index = this.state.highlightedIndex;
    this.handleSelection(this.state.results[index]);
  };

  handleKeydown = (event) => {
    let numResults = this.state.results.length;
    if (numResults === 0) {
      return;
    }

    let index = this.state.highlightedIndex;
    switch (event.keyCode) {
      case Keys.down:
        index++;
        if (index > numResults - 1) {
          index = 0;
        }
        this.setState({highlightedIndex: index});
        event.preventDefault();
        break;
      case Keys.up:
        index--;
        if (index < 0) {
          index = numResults - 1;
        }
        this.setState({highlightedIndex: index});
        event.preventDefault();
        break;
      case Keys.enter:
        this.handleSelection(this.state.results[index]);
        break;
      default:
        break;
    }
  };

  handleMouseMove = (event) => {
    let node = event.target;
    let index = Array.from(node.parentNode.childNodes).indexOf(node);
    this.setState({highlightedIndex: index});
  };

  handleMouseLeave = (event) => {
    this.setState({highlightedIndex: -1});
  };

  handleSelection = (entry) => {
    if (!entry) {
      return;
    }
    let input = this._inputRef.current;
    let inputValue = input.value;
    if (this.props.onSelect) {
      this.props.onSelect(entry, input);
    }
    // allow onSelect to change the value of the input
    if (input.value === inputValue) {
      input.value = entry.getText();
    }
    this.setState({results: []});
  };

  render() {
    this._inputRef = React.createRef();

    return (
      <div className={styles.Typeahead_root}>
        <input
          ref={this._inputRef}
          autoFocus
          type="text"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder={this.props.placeholder || "Search"}
          className={styles.Typeahead_input}
          onInput={this.handleInput}
          onKeyDown={this.handleKeydown}
        />
        {this.state.results.length > 0 ? (
          <ul
            className={styles.Typeahead_results}
            onClick={this.handleClick}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}>
            {this.state.results.map((entry, index) => {
              let className = styles.Typeahead_result;
              if (index === this.state.highlightedIndex) {
                className += " " + styles.highlighted;
              }
              return (
                <li className={className} key={entry.getValue()}>
                  {this.props.renderer(entry)}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }
}
