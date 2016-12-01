import React, { PropTypes } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import styles from './styles.css'
import Courselist from './Courselist';
import CourseDisplay from './CourseDisplay';
import Collapsible from 'react-collapsible';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';


const Library = ({ courses, selectedCourse, hasFolders, folders }) => {
  const courseNames = [];
  for (let course in courses) {
    courseNames.push(courses[course].courseName);
  }

  const selectedCourseName = selectedCourse.courseName;
  return(
    <div id="librarybar-container" className="clearfix">

      <div id="library-menu">
      <Collapsible trigger="Courses" transitionTime={100} overflowWhenOpen='scroll' open={true}>
        <ListGroup style={{paddingLeft:"15px", paddingRight:"15px"}}>
          {courseNames.map(courseName =>
            <Courselist key={courseName} courseName={courseName} selectedCourse={selectedCourseName} />
          )}
        </ListGroup>
      </Collapsible>
      <Collapsible trigger="Folders" transitionTime={100} overflowWhenOpen="auto">
        <div style={{textAlign:"center", marginTop:"20px", borderBottom:"thin solid #B0B0B0"}}>
          { hasFolders ?
          <ListGroup style={{paddingLeft:"15px", paddingRight:"15px"}}>

          </ListGroup>
          : <p id="none-tag"> You have no folders. Create folders to organize and manage your own selections of Chapters. </p>
          }
          <Button id="addFolderBtn"><AddIcon style={{color:"#34c749", fontSize:"26px"}}/></Button>
        </div>
      </Collapsible>
      <Collapsible trigger="All Chapters" transitionTime={100} overflowWhenOpen="auto">
      </Collapsible>
      </div>

      <div id="course-display">
          <CourseDisplay courseName={selectedCourseName} chapters={selectedCourse.chapters}/>
      </div>
    </div>
  );
};

Library.propTypes = {
  selectedCourse: PropTypes.object.isRequired,
  hasFolders: PropTypes.bool.isRequired,
  courses: PropTypes.array.isRequired,
  folders: PropTypes.array
};

export default Library;
