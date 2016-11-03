import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import ClassContainer from './ClassContainer/index.js'

class StudentHome extends React.Component {
  render() {
    return (
      <div className="student-container">
      <Header />
        <Grid>
          <ClassContainer />
          <ClassContainer />
        </Grid>
      </div>
    );
  }
}

export default StudentHome;