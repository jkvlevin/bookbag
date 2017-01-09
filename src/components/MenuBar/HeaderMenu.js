import React, { PropTypes } from 'react';
import { Navbar, NavDropdown, MenuItem, Nav, NavItem, Col } from 'react-bootstrap';
import SearchIcon from 'react-icons/lib/go/search';

const HeaderMenu = ({logout, handleCoursesClick, handleSearchClick}) => {
  return (
    <Navbar inverse fixedTop collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/student">BookBag</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
      <Nav pullRight>
        <NavItem eventKey={2} onClick={handleSearchClick} style={{marginLeft:"-15%"}}><SearchIcon style={{fontSize:"16px"}}/> Search</NavItem>
        <NavDropdown eventKey="1" title={localStorage.getItem('userName')} id="nav-dropdown" style={{marginLeft:"15%"}}>
          <MenuItem eventKey={1.1} onClick={handleCoursesClick}>My Library</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={1.2} onClick={logout}>Logout</MenuItem>
        </NavDropdown>
      </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

HeaderMenu.propTypes = {
  logout: PropTypes.func.isRequired,
  handleCoursesClick: PropTypes.func.isRequired,
  handleSearchClick: PropTypes.func.isRequired
};

export default HeaderMenu;
