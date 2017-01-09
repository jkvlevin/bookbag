import React, { PropTypes } from 'react';
import { Button, DropdownButton, MenuItem, ListGroup, ListGroupItem, Navbar } from 'react-bootstrap';
import SearchIcon from 'react-icons/lib/fa/search.js';
import LibraryIcon from 'react-icons/lib/md/library-books.js';
import ToolsIcon from 'react-icons/lib/go/tools';
import BrowseIcon from 'react-icons/lib/md/local-library.js';
import NotificationsIcon from 'react-icons/lib/md/mail';
import SettingsIcon from 'react-icons/lib/md/settings';
import Logo from 'react-icons/lib/go/squirrel';
import styles from './styles.css'


const Sidebar = ({ handleWorkbenchClick, handleSearchClick, logout, userName }) => {
  return (
    <div id="sidebar-container">
      <h2 style={{color:"#807F83", textAlign:"center", marginBottom:"35px", fontSize:"20px"}}> <div id="logo"><Logo /></div> <br/> BookBag </h2>
      <div id="sidebar-menu">
        <Button id="menu-button" onClick={handleWorkbenchClick}><ToolsIcon id="menu-icon"/></Button> <h3 id="menu-title">Workbench</h3> <br/><br/><br/>
        <Button id="menu-button" onClick={handleSearchClick}><SearchIcon id="menu-icon"/></Button> <h3 id="menu-title">Search</h3> <br/><br/><br/>

        <div id="pref-container">
          <DropdownButton dropup pullLeft noCaret id="settings-menu" title={<SettingsIcon id="menu-icon" style={{fontSize:"28px", color:"#1db954", marginLeft:"-4px"}}/>} style={{width:"45px", height:"45px", borderRadius:"25px"}}>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </DropdownButton>
          <h3 style={{fontSize:"12px"}}> {userName} </h3>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  handleWorkbenchClick: PropTypes.func,
  handleSearchClick: PropTypes.func,
  logout: PropTypes.func,
  userName: PropTypes.string,
};

export default Sidebar;
