import React, { PropTypes } from 'react';
import { Navbar, NavDropdown, MenuItem, Nav, NavItem, Col } from 'react-bootstrap';

const HeaderMenu = ({logout, handleCoursesClick}) => {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/student">BookBag</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
      <Nav pullRight>
        <NavItem eventKey={1} onClick={handleCoursesClick}>My Library</NavItem>
        <NavItem eventKey={2}>Search</NavItem>
        <NavItem eventKey={3} onClick={logout}>Logout</NavItem>
      </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

HeaderMenu.propTypes = {
  logout: PropTypes.func.isRequired,
  handleCoursesClick: PropTypes.func.isRequired
};

export default HeaderMenu;
