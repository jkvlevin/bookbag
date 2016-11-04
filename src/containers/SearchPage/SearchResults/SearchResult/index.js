import React from 'react';
import { Link } from 'react-router';
import styles from './styles.css';

class SearchResult extends React.Component {
  render() {
    return (
      <div className="searchresult" style={{textAlign:"left"}}>
          <h4>Random Variables</h4>
          <strong>By Chris Giglio</strong>
          <p>This is a chapter about random variables</p>
      </div>
    );
  }
}

export default SearchResult;
