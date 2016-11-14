import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import * as actions from './actions.js';

{/* TODO condense handlers into general, form validation */}

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
    this.props.login(this.state.email, this.state.password);
    this.setState({email: '', password: ''});
  }

  render() {
    return (
      <div className="login-container">
        <div className="login-box"> <br />
          <h2 style={{color:"white", fontSize:"28px", marginLeft:"155px"}}> Sign In </h2>
          <Form horizontal onSubmit={this.handleSubmit} style={{padding:"40px", textAlign:"center"}}>
            <FormGroup controlId="formHorizontalEmail">
              <FormControl type="email" value={this.state.email} placeholder="Email" onChange={this.handleEChange} />
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <FormControl type="password" value={this.state.password} placeholder="Password" onChange={this.handlePChange}/>
            </FormGroup>

            <FormGroup>
              <Button type="submit" className="login-button" onClick={this.handleSubmit} style={{background:"#008800", color:"white", borderColor:"#008800", width:"200px", height:"40px"}}>
                Sign In
              </Button>
            </FormGroup>

            <FormGroup>
              <p style={{color:"white"}}> Not a member yet? <a href="/signup" style={{color:"#008800", marginLeft:"10px"}}>Sign up now</a> </p>
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
