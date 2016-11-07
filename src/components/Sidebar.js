import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

const Sidebar = ({ handleSearch }) => {
  return (
    <div style={{width:"140px", height:"100vh", backgroundColor:"#2ebd59", padding:"10px", float:"left"}}>
      <h4 style={{marginTop:"80px"}}> Subscriptions </h4>
      <Button style={{backgroundColor:"rgba(0,0,0,0)", border:"none"}}> Current Courses </Button>
      <Button style={{backgroundColor:"rgba(0,0,0,0)", border:"none"}}> My Chapters </Button>
      <h4 style={{marginTop:"20px"}}> Discover </h4>
      <Button onClick={handleSearch} style={{backgroundColor:"rgba(0,0,0,0)", border:"none"}}> Search </Button>
      <Button style={{backgroundColor:"rgba(0,0,0,0)", border:"none"}}> Browse </Button>
    </div>
  );
};

Sidebar.propTypes = {
  handleSearch: PropTypes.func.isRequired
};

export default Sidebar;
