import React, { PropTypes } from 'react';
import { ListGroup, Nav, NavItem } from 'react-bootstrap';
import ChapterList from './ChapterList';

const CourseDisplay = ({ courseName, chapters }) => {
  return (
    <div style={{width:"78%"}}>
      <h1 style={{marginLeft:"25px", fontSize:"24px", color:"#807F83"}}> {courseName} </h1>
      <div id="course-box" style={{width:"100%", height:"100%", marginTop:"thin solid #B0B0B0"}}>
        <ListGroup id="chapter-list" style={{marginLeft:"30px", marginTop:"25px", overflowY:"scroll"}}>
          {chapters.map(chapter =>
            <ChapterList key={chapter.id} name={chapter.name} owner={chapter.owner} id={chapter.id} />
          )}
        </ListGroup>
        <h1 style={{marginLeft:"25px", fontSize:"18px", color:"#807F83"}}> Course Notes </h1>
        <div id="course-notes" style={{height:"50%", overflowY:"auto"}}>
          <Nav bsStyle="tabs" activeKey="1" id="library-nav">
            <NavItem eventKey="1">Lecture 1</NavItem>
            <NavItem eventKey="2">Lecture 2</NavItem>
            <NavItem eventKey="3">Lecture 3</NavItem>
          </Nav>
        </div>
      </div>
    </div>
  );
};

CourseDisplay.propTypes = {
  courseName: PropTypes.string.isRequired,
  chapters: PropTypes.array,
};

export default CourseDisplay;
