import React, { PropTypes } from 'react';

const CourseDisplay = ({ courseName, chapters }) => {
  return (
    <div>
      <h1 style={{marginLeft:"25px", fontSize:"24px", color:"#807F83"}}> {courseName} </h1>
      <div id="course-box" style={{width:"100%", marginTop:"thin solid #B0B0B0"}}>
        
      </div>
    </div>
  );
};

CourseDisplay.propTypes = {
  courseName: PropTypes.string.isRequired,
  chapters: PropTypes.array.isRequired,
};

export default CourseDisplay;
