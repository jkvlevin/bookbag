import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import LoginBox from '../../containers/LoginPage/LoginBox'

class LoginPage extends React.Component {
  render() {
    return (
      <div className="login-container">
      <Header />
      <Grid>
        <LoginBox />
      </Grid>
      </div>
    );
  }
}

export default LoginPage;
