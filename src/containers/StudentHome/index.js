import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Well, Button, Glyphicon } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import Sidebar from '../../components/Sidebar';
import { browserHistory } from 'react-router';

class StudentHome extends React.Component {
  constructor(props) {
   super(props);
   this.handleSearch = this.handleSearch.bind(this);
 }

  handleSearch() {
    browserHistory.push('/search');
  }

  render() {
    return (
      <div className="student-container">
        <Header showSearch hasUser/>
        <h2 style={{marginTop:"80px", marginLeft:"40px"}}> Welcome, Jake </h2>
        <Well id="courses">
          <Button style={{float:"left"}}><Glyphicon glyph="align-justify" /></Button><h4 style={{marginLeft:"60px"}}>My Courses </h4>
        </Well>
      </div>
    );
  }
}

export default StudentHome;
