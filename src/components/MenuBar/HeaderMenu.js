import React, { PropTypes } from 'react';
import { Navbar, NavDropdown, MenuItem, Nav, NavItem, Col } from 'react-bootstrap';

const HeaderMenu = ({logout}) => {
  return (
    <Navbar id="headermenu-container" inverse fixedTop style={{textAlign:"right", backgroundColor:"#262228"}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/student">BookBag</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
      <Nav pullRight>
        <NavDropdown title={localStorage.getItem('userName')} eventKey={1} id="user-dropdown" style={{width:"200px", textAlign:"right"}}>
          <MenuItem eventKey={1.1}>My Library</MenuItem>
          <MenuItem eventKey={1.3}>Search</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={1.6} onClick={logout}>Logout</MenuItem>
        </NavDropdown>
      </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

HeaderMenu.propTypes = {
  logout: PropTypes.func.isRequired
};

export default HeaderMenu;
