import React from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';

class LoginPage extends React.Component {
  render() {
    return (
      <div className="login-container">
      <Header />
      <Grid>
        <Form horizontal style={{marginTop:"32vh"}}>
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
             <Button type="submit" style={{width:"100%"}}>
               Sign in
             </Button>
           </Col>
         </FormGroup>
       </Form>
      </Grid>
      </div>
    );
  }
}

export default LoginPage;
