import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../../components/Header';
import styles from './styles.css';

class LoginBox extends React.Component {
  render() {
    return (
      <div className="login-box">
        <Form horizontal style={{padding:"1px 0"}}>
          <h3 style={{color:"white",textAlign:"center"}}>Login</h3>
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
             <Checkbox>Remember me</Checkbox>
           </Col>
         </FormGroup>
         <FormGroup>
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <Button className="login-button" type="submit" style={{width:"100%", background:"#4A90E2", borderColor:"#4A90E2"}}>
               Sign in
             </Button>
           </Col>
         </FormGroup>
         <FormGroup>
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <a href="#">Forgot Password?</a>
           </Col>
         </FormGroup>
         <FormGroup>
           <Col xs={6} xsOffset={3} sm={6} smOffset={3} md={4} mdOffset={4} lg={4} lgOffset={4}>
             <a href='/signup'>Sign Up</a>
           </Col>
         </FormGroup>
       </Form>
      </div>
    );
  }
}

export default LoginBox;
