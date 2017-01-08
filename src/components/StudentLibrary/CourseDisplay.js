import React, { PropTypes } from 'react';
import { ListGroup, Nav, NavItem } from 'react-bootstrap';
import ChapterList from './ChapterList';

const CourseDisplay = ({ courseName, chapters }) => {
  return (
    <div style={{width:"90%", marginTop:"20px"}}>
      <h1 style={{marginLeft:"25px", fontSize:"24px", color:"#807F83"}}> {courseName} </h1>
      <div id="course-box" style={{width:"100%", height:"100%"}}>
        <ListGroup id="chapter-list" style={{marginLeft:"30px", marginTop:"30px", overflowY:"scroll"}}>
          {chapters.map(chapter =>
            <ChapterList key={chapter.id} name={chapter.name} owner={chapter.owner} id={chapter.id} pdfUrl={chapter.pdf_url} />
          )}
        </ListGroup>
        
      </div>
    </div>
  );
};

CourseDisplay.propTypes = {
  courseName: PropTypes.string.isRequired,
  chapters: PropTypes.array,
};

export default CourseDisplay;
