import React, { PropTypes } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';



const Sidebar = ({ courses, handleCoursesClick, handleBrowseClick, handleSearchClick, handleSettingsClick, addCourseModal }) => {
  const coursesMIStyle = {
    backgroundColor: "#262228",
    borderColor: "#262228",
    float:"left",
    width:"100px",
    color:"#B0B0B0",
    marginTop:"80px",
  };

  const menuItemStyle = {
    backgroundColor: "#262228",
    borderColor: "#262228",
    float:"left",
    width:"100px",
    color:"#B0B0B0",
  };

  return (
    <div style={{width:"140px", height:"100vh", backgroundColor:"#262228", padding:"10px", float:"left"}}>
      <Button style={coursesMIStyle} onClick={handleCoursesClick}>My Courses</Button>
      <ListGroup style={{marginTop:"115px"}}>
        {courses.map(course =>
          <ListGroupItem key={course.coursename} style={{color:"#B0B0B0", backgroundColor:"#262228", borderColor:"#262228", fontSize:"13px", marginTop:"-10px"}}>{course.coursename}</ListGroupItem>
        )}
      </ListGroup>
      <Button style={menuItemStyle} onClick={addCourseModal}><AddIcon style={{marginLeft:"11px", fontSize:"28px", color:"#B0B0B0", marginTop:"-20px"}}/></Button>
      <hr style={{width:"100px"}}/>
      <Button style={menuItemStyle} onClick={handleBrowseClick}>Browse</Button>
      <Button style={menuItemStyle} onClick={handleSearchClick}>Search</Button>
      <Button style={menuItemStyle} onClick={handleSettingsClick}>Settings</Button>

    </div>
  );
};

Sidebar.propTypes = {
  courses: PropTypes.array.isRequired,
  handleCoursesClick: PropTypes.func.isRequired,
  handleBrowseClick: PropTypes.func.isRequired,
  handleSearchClick: PropTypes.func.isRequired,
  handleSettingsClick: PropTypes.func.isRequired,
  addCourseModal: PropTypes.func.isRequired
};

export default Sidebar;
