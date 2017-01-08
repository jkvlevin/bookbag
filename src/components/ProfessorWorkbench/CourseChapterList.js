import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import DeleteIcon from 'react-icons/lib/go/x';

const CourseChapterList = ({ name, id, author, description }) => {
  return (
    <div>
      <ListGroupItem style={{textAlign:"left"}}>
        <a style={{marginLeft:"15px", float:"left"}}>{name}</a>
        <p style={{marginLeft:"5px", marginTop:"2px", fontSize:"11px", display:"inline"}}> - {author} </p>
        <p style={{display:"inline", marginLeft:"40px", fontSize:"11px", fontStyle:"italic"}}> "{description}" </p>
        <DeleteIcon style={{float:"right", marginRight:"10px", fontSize:"16px", color:"#BF3309"}}/>
      </ListGroupItem>
    </div>
  );
};

CourseChapterList.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default CourseChapterList;
