import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../../components/Header';
import styles from './styles.css';
import SearchResult from './SearchResult'

class SearchResults extends React.Component {
  render() {
    return (
      <div className="searchresults-box">
          <h3 style={{marginTop: "12vh",textAlign:"center"}}>Search Results</h3>
          <h4 style={{textAlign:"center"}}> for "probability theory" </h4>
          <hr style={{borderColor:"black"}}/>
          <SearchResult />
          <SearchResult />
          <SearchResult />
          <SearchResult />
      </div>
    );
  }
}

export default SearchResults;
