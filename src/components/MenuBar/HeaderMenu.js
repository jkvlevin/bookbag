import React, { PropTypes } from 'react';
import { Navbar, NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';

const HeaderMenu = ({currentUser}) => {
  return (
    <div id="headermenu-container">
      <Navbar inverse fixedTop style={{textAlign:"center", height:"20px", backgroundColor:"#262228"}}>
      <Navbar.Header>
        <Navbar.Brand>
          <p>BookBag</p>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
      <NavDropdown eventKey={1} title={currentUser} id="menu-dropdown">
        <MenuItem eventKey={1.1}>My Library</MenuItem>
        <MenuItem eventKey={1.2}>Browse</MenuItem>
        <MenuItem eventKey={1.3}>Search</MenuItem>
        <MenuItem eventKey={1.4}>Notifications</MenuItem>
        <MenuItem divider />
        <MenuItem href={'/'} eventKey={1.5}>Logout</MenuItem>
      </NavDropdown>
      </Nav>
      {/* <Navbar.Collapse>
        <Nav pullRight>
          <MenuItem eventKey={1.1}>My Library</MenuItem>
          <MenuItem eventKey={1.2}>Browse</MenuItem>
          <MenuItem eventKey={1.3}>Search</MenuItem>
          <MenuItem eventKey={1.4}>Notifications</MenuItem>
          <MenuItem divider />
          <MenuItem href={'/'} eventKey={1.5}>Logout</MenuItem>
        </Nav>
      </Navbar.Collapse> */}
    </Navbar>
  </div>
  );
};

HeaderMenu.propTypes = {
  currentUser: PropTypes.string
};

export default HeaderMenu;
