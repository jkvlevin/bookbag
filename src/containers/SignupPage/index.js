import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import * as actions from './actions.js';
import toastr from 'toastr';

{/* TODO CLEANUP GENERAL HANDLERS, ADD CREATE ACCOUNT VALIDATION., MORE FIELDS? */}

class SignupPage extends React.Component {
  constructor(props) {
   super(props);
   this.state = { email: '', password: '', passwordConfirm: '', name: ''};
   this.handleEChange = this.handleEChange.bind(this);
   this.handlePChange = this.handlePChange.bind(this);
   this.handlePCChange = this.handlePCChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.handleNameChange = this.handleNameChange.bind(this);
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

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.password == this.state.passwordConfirm) {
      this.props.createAccount(this.state.name, this.state.email, this.state.password);
      this.setState({email: '', password: '', passwordConfirm: ''});
    } else {
      toastr.error('Passwords do not match');
    }
  }
  render() {
    return (
      <div className="signup-container">
      <Header showSearch={false} hasUser={false}/>
      <h3 className="texts"> Sign up for BookBag today and get access to <br /> <br />
        <h4 className="texts2" style={{color:"#98d2eb", marginLeft:"15px"}}> Course management platform </h4> <br />
        <h4 className="texts2" style={{color:"#98d2eb", marginLeft:"15px"}}> Curated chapters of information written by professors worldwide </h4> <br />
        <h4 className="texts2" style={{color:"#98d2eb", marginLeft:"15px"}}> Unlimited chapter subscriptions </h4> <br />
      </h3>


      <div className="signup-box"> <br />
        <h2 style={{color:"white", fontSize:"28px", marginLeft:"70px"}}> Sign up for BookBag </h2>
        <Form horizontal onSubmit={this.handleSubmit} style={{padding:"40px", textAlign:"center"}}>

          <FormGroup controlId="formHorizontal">
            <FormControl type="text" value={this.state.name} placeholder="Name" onChange={this.handleNameChange} />
          </FormGroup>

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
            <Button type="submit" className="login-button" onClick={this.handleSubmit} style={{background:"#008800", borderColor:"#008800", color:"white", width:"150px", height:"40px", marginTop:"20px"}}>
              Create Account
            </Button>
          </FormGroup>

        </Form>
      </div>
      </div>
    );
  }
}

SignupPage.propTypes = {
  createAccount: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    isValid: state.signupReducer.isValid
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createAccount: (name, email, password) => dispatch(actions.createAccount(name, email, password))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
