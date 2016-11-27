import React, { PropTypes } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import styles from './styles.css'
import Courselist from './Courselist';
import Collapsible from 'react-collapsible';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';


const Library = ({ courseNames, selectedCourse, hasFolders, folders }) => {
  return (
    <div id="librarybar-container" class="clearfix">

      <div id="library-menu">
      <Collapsible trigger="Courses" transitionTime={100} overflowWhenOpen='scroll' open={true}>
        <ListGroup style={{paddingLeft:"15px", paddingRight:"15px"}}>
          {courseNames.map(courseName =>
            <Courselist key={courseName} courseName={courseName} selectedCourse={selectedCourse} />
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
          <Button id="addFolderBtn"><AddIcon style={{color:"#2DBE60", fontSize:"26px"}}/></Button>
        </div>
      </Collapsible>
      <Collapsible trigger="All Chapters" transitionTime={100} overflowWhenOpen="auto">
      </Collapsible>
      </div>

      <div id="course-display">
        <h1> {selectedCourse} </h1>
      </div>
    </div>
  );
};

Library.propTypes = {
  courseNames: PropTypes.array.isRequired,
  selectedCourse: PropTypes.string.isRequired,
  hasFolders: PropTypes.bool.isRequired,
  courses: PropTypes.array.isRequired,
  folders: PropTypes.array
};

export default Library;
