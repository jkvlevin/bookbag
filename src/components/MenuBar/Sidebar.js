import React, { PropTypes } from 'react';
import { Button, ListGroup, ListGroupItem, Navbar } from 'react-bootstrap';
import SearchIcon from 'react-icons/lib/fa/search.js';
import LibraryIcon from 'react-icons/lib/md/library-books.js';
import BrowseIcon from 'react-icons/lib/md/local-library.js';
import NotificationsIcon from 'react-icons/lib/md/mail';
import SettingsIcon from 'react-icons/lib/md/settings';
import styles from './styles.css'


const Sidebar = ({ handleCoursesClick, handleBrowseClick, handleSearchClick, handleSettingsClick, userName }) => {
  return (
    <div id="sidebar-container">
      <h2 style={{color:"#807F83", marginLeft:"20px", marginBottom:"25px", fontSize:"20px"}}> BookBag </h2>
      <div id="sidebar-menu">
        <Button id="menu-button" onClick={handleCoursesClick}><LibraryIcon id="menu-icon"/></Button> <h3 id="menu-title">My Library</h3> <br/><br/><br/>
        <Button id="menu-button" onClick={handleBrowseClick}><BrowseIcon id="menu-icon"/></Button> <h3 id="menu-title">Browse</h3> <br/><br/><br/>
        <Button id="menu-button" onClick={handleSearchClick}><SearchIcon id="menu-icon"/></Button> <h3 id="menu-title">Search</h3> <br/><br/><br/>
        <Button id="menu-button"><NotificationsIcon id="menu-icon"/></Button> <h3 id="menu-title">Notifications</h3>

        <div id="pref-container">
          <Button id="menu-button" onClick={handleSettingsClick} style={{marginLeft:"35px", marginBottom:"10px", width:"45px", height:"45px"}}><SettingsIcon id="menu-icon" style={{fontSize:"28px"}}/></Button> <br/>
          <h3 style={{fontSize:"12px"}}> {userName} </h3>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  handleCoursesClick: PropTypes.func.isRequired,
  handleBrowseClick: PropTypes.func.isRequired,
  handleSearchClick: PropTypes.func.isRequired,
  handleSettingsClick: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired
};

export default Sidebar;
