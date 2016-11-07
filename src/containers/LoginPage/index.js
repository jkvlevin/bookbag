import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import * as actions from './actions.js';

class LoginPage extends React.Component {
  constructor(props) {
   super(props);
   this.state = { email: '', password: '' };
   this.handleEChange = this.handleEChange.bind(this);
   this.handlePChange = this.handlePChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEChange(event) {
    this.setState({email: event.target.value});
  }

  handlePChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    alert('Text field value is: ' + this.state.email + this.state.password);
    this.props.login(this.state.email, this.state.password);
    this.setState({email: '', password: ''});
  }

  render() {
    return (
      <div className="login-container">
      <Header showSearch={false} hasUser={false}/>
        <div className="login-box">
          <Form horizontal onSubmit={this.handleSubmit} style={{padding:"40px", textAlign:"center"}}>
            <FormGroup controlId="formHorizontalEmail">
              <FormControl type="email" value={this.state.email} placeholder="Email" onChange={this.handleEChange} />
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <FormControl type="password" value={this.state.password} placeholder="Password" onChange={this.handlePChange}/>
            </FormGroup>

            <FormGroup>
              <Button type="submit" className="login-button" onClick={this.handleSubmit} style={{background:"#0375b4", borderColor:"#0375b4", width:"100px", height:"40px"}}>
                Sign in
              </Button>
            </FormGroup>

            <FormGroup>
              <a href="/signup">Sign Up</a>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    hasUser: state.loginReducer.hasUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password) => dispatch(actions.login(email, password))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
