import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../../components/Header';
import styles from './styles.css';

class SignupBox extends React.Component {
  render() {
    return (
      <div className="signup-box">
        <Form horizontal style={{padding:"1px 0"}}>
          <h3 style={{color:"white",textAlign:"center"}}>Sign Up</h3>
          <FormGroup controlId="formHorizontalEmail">
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <FormControl type="email" placeholder="Name" />
           </Col>
         </FormGroup>
         <FormGroup controlId="formHorizontalEmail">
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <FormControl type="email" placeholder="Email" />
           </Col>
         </FormGroup>
         <FormGroup controlId="formHorizontalPassword">
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <FormControl type="password" placeholder="Password" />
           </Col>
         </FormGroup>

         <FormGroup>
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <FormControl type="password" placeholder="Re-Type Password" />
           </Col>
         </FormGroup>
         <FormGroup>
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <Button className="login-button" type="submit" style={{width:"100%", background:"#4A90E2", borderColor:"#4A90E2"}}>
               Create Account
             </Button>
           </Col>
         </FormGroup>
       </Form>
      </div>
    );
  }
}

export default SignupBox;
