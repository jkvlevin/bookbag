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
   this.state = { email: '', password: '', passwordConfirm: '', firstName: '', lastName: ''};

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
    if (event.target.name === "first") {
      this.setState({firstName: event.target.value});
    } else if (event.target.name === "last") {
      this.setState({lastName: event.target.value});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const isProf = this.refs.prof_checked.checked;
    if (this.state.password == this.state.passwordConfirm) {
      this.props.createAccount(this.state.firstName, this.state.lastName, this.state.email, this.state.password, isProf);
      this.setState({email: '', password: '', passwordConfirm: '', firstName:'', lastName:'' });
    } else {
      toastr.error('Passwords do not match');
    }

  }
  render() {
    return (
      <div className="signup-container">
      <Header showSearch={false} hasUser={false}/>
      <h3 className="texts"> Sign up for BookBag today and get access to <br /> <br />
        <h4 className="texts2" style={{color:"#98d2eb"}}> Course management platform </h4> <br /> <br />
        <h4 className="texts2" style={{color:"#98d2eb"}}> Curated chapters of information written by professors worldwide </h4> <br /> <br />
        <h4 className="texts2" style={{color:"#98d2eb"}}> Unlimited chapter subscriptions </h4> <br />
      </h3>


      <div className="signup-box"> <br />

        <div style={{textAlign:"center"}}><h2 style={{color:"white", fontSize:"28px"}}> Sign up for BookBag </h2></div>
        <Form horizontal onSubmit={this.handleSubmit} style={{padding:"40px", textAlign:"center"}}>

          <FormGroup controlId="formHorizontal">
            <FormControl type="text" value={this.state.name} name="first" placeholder="First Name" onChange={this.handleNameChange} style={{width:"47%", float:"left"}}/>
            <FormControl type="text" value={this.state.name} name="last" placeholder="Last Name" onChange={this.handleNameChange} style={{width:"47%", marginLeft:"52%"}}/>
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

          <label style={{color:"#BFBFBF", fontWeight:"normal", fontSize:"11px"}}>
            <input type="checkbox" ref="prof_checked" /> I am a Princeton University Professor or Graduate Student
          </label>

          <FormGroup>
            <Button type="submit" className="login-button" onClick={this.handleSubmit} style={{background:"#1db954", borderColor:"#1db954", color:"white", width:"150px", height:"40px", marginTop:"20px"}}>
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
    createAccount: (firstName, lastName, email, password, isProf) => dispatch(actions.createAccount(firstName, lastName, email, password, isProf))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
