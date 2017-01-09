import React, { PropTypes } from 'react';
import { ListGroup, Nav, NavItem } from 'react-bootstrap';
import ChapterList from './ChapterList';

const FolderDisplay = ({ folderName, description, chapters, folders, addToFolder}) => {
  return (
    <div style={{marginTop:"20px", width:"95%", height:"95%"}}>
      <h1 style={{marginLeft:"25px", fontSize:"24px", color:"#807F83"}}> {folderName} </h1>
      <p style={{marginLeft:"25px", fontSize:"13px", color:"#878787"}}>{description}</p>
      <div id="course-box" style={{width:"100%", height:"100%"}}>
        <ListGroup id="chapter-list" style={{marginLeft:"30px", marginTop:"40px", overflowY:"scroll"}}>
          {chapters.map(chapter =>
            <ChapterList key={chapter.id} name={chapter.name} folders={folders} addToFolder={addToFolder} owner={chapter.ownername} id={chapter.id} pdfUrl={chapter.pdf_url} />
          )}
        </ListGroup>

      </div>
    </div>
  );
};

FolderDisplay.propTypes = {
  folderName: PropTypes.string.isRequired,
  chapters: PropTypes.array,
  folders: PropTypes.array,
  addToFolder: PropTypes.func.isRequired,
  description: PropTypes.string
};

export default FolderDisplay;
