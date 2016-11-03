import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import SignupBox from '../../containers/SignupPage/SignupBox'

class SignupPage extends React.Component {
  render() {
    return (
      <div className="signup-container">
      <Header />
      <Grid>
        <SignupBox />
      </Grid>
      </div>
    );
  }
}

export default SignupPage;
