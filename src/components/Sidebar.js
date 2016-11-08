import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';

const Sidebar = () => {
  return (
    <div style={{width:"140px", height:"100vh", backgroundColor:"#262228", padding:"10px", float:"left"}}>
      <h4 style={{marginTop:"80px", color:"#B0B0B0", marginLeft:"5px"}}> My Courses </h4>
    </div>
  );
};

export default Sidebar;
