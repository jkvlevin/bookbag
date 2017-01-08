import React, { PropTypes } from 'react';
import { Navbar, NavDropdown, MenuItem, Nav, NavItem, Col } from 'react-bootstrap';

const HeaderMenu = ({}) => {
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
          {/* <MenuItem eventKey={1.2}>Browse</MenuItem> */}
          <MenuItem eventKey={1.3}>Search</MenuItem>
          {/* <MenuItem eventKey={1.4}>Notifications</MenuItem> */}
          {/* <MenuItem eventKey={1.5}>Settings</MenuItem> */}
          <MenuItem divider />
          <MenuItem href={'/'} eventKey={1.6}>Logout</MenuItem>
        </NavDropdown>
      </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

HeaderMenu.propTypes = {
};

export default HeaderMenu;
