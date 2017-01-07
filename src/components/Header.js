import React, { PropTypes } from 'react';
import { Navbar, NavDropdown, MenuItem, Nav, NavItem, FormGroup, FormControl } from 'react-bootstrap';
import SearchBar from './SearchBar.js';

const Header = ({ showSearch, hasUser }) => {
  return (
    <Navbar inverse fixedTop style={{textAlign:"center", backgroundColor:"#262228"}}>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">BookBag</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
        <Navbar.Form style={{display:"inline-block"}}>
          {showSearch ? <SearchBar /> : ""}
        </Navbar.Form>
      <Nav pullRight>
        {hasUser ? <NavDropdown title={localStorage.getItem('userName')} eventKey={1} id="user-dropdown">
          <MenuItem eventKey={1.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem divider />
          <MenuItem href={'/'} eventKey={3.3}>Logout</MenuItem>
        </NavDropdown> : <NavItem eventKey={2} href="/login">Login</NavItem>}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  );
};

Header.propTypes = {
  showSearch: PropTypes.bool.isRequired,
  hasUser: PropTypes.bool.isRequired
};

export default Header;
