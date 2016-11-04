import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import SearchResults from '../../containers/SearchPage/SearchResults'

class SearchPage extends React.Component {
  render() {
    return (
      <div className="search-container">
      <Header />
      <Grid>
        <SearchResults />
      </Grid>
      </div>
    );
  }
}

export default SearchPage;
