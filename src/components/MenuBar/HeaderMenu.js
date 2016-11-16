import React, { PropTypes } from 'react';
import { Navbar, NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';

const HeaderMenu = ({currentUser}) => {
  return (
    <Navbar id="headermenu-container" inverse fixedTop style={{textAlign:"center", backgroundColor:"#262228"}}>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/student">BookBag</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <NavDropdown title={currentUser} eventKey={1} id="user-dropdown">
          <MenuItem eventKey={1.1}>My Library</MenuItem>
          <MenuItem eventKey={1.2}>Browse</MenuItem>
          <MenuItem eventKey={1.3}>Search</MenuItem>
          <MenuItem eventKey={1.4}>Notifications</MenuItem>
          <MenuItem divider />
          <MenuItem href={'/'} eventKey={1.5}>Logout</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  );
};

HeaderMenu.propTypes = {
  currentUser: PropTypes.string
};

export default HeaderMenu;
