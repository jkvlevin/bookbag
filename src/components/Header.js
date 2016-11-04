import React, {PropTypes} from 'react';
import { Navbar, Nav, NavItem, FormGroup, FormControl } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar inverse fixedTop style={{textAlign:"center"}}>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">BookBag</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
        <Navbar.Form style={{display:"inline-block"}}>
          <FormGroup>
            <FormControl type="text" placeholder="Search" />
          </FormGroup>
        </Navbar.Form>
      <Nav pullRight>
        <NavItem eventKey={1} href="/about">About</NavItem>
        <NavItem eventKey={2} href="/login">Login</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  );
};

export default Header;
