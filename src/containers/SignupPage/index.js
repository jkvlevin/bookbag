import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import toastr from 'toastr';
import { createAccount } from './actions.js';

class SignupPage extends React.Component {
  constructor(props) {
   super(props);
   this.state = { email: '', password: '', passwordConfirm: '' };
   this.handleEChange = this.handleEChange.bind(this);
   this.handlePChange = this.handlePChange.bind(this);
   this.handlePCChange = this.handlePCChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEChange(event) {
    this.setState({email: event.target.value});
  }

  handlePChange(event) {
    this.setState({password: event.target.value});
  }

  handlePCChange(event) {
    this.setState({passwordConfirm: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.password == this.state.passwordConfirm) {
      createAccount(this.state.email, this.state.password);
      this.setState({email: '', password: '', passwordConfirm: ''});
    } else {
      toastr.error('Passwords do not match');
    }
  }
  render() {
    return (
      <div className="signup-container">
      <Header showSearch={false} hasUser={false}/>
      <div className="signup-box">
        <Form horizontal onSubmit={this.handleSubmit} style={{padding:"40px", textAlign:"center"}}>
          <FormGroup controlId="formHorizontalEmail">
            <FormControl type="email" value={this.state.email} placeholder="Email" onChange={this.handleEChange} />
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <FormControl type="password" value={this.state.password} placeholder="Password" onChange={this.handlePChange}/>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <FormControl type="password" value={this.state.passwordConfirm} placeholder="Confirm Password" onChange={this.handlePCChange}/>
          </FormGroup>

          <FormGroup>
            <Button type="submit" className="login-button" onClick={this.handleSubmit} style={{background:"#0375b4", borderColor:"#0375b4", width:"150px", height:"40px"}}>
              Create Account
            </Button>
          </FormGroup>

        </Form>
      </div>
      </div>
    );
  }
}

export default SignupPage;
