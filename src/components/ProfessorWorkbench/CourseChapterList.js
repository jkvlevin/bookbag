import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import DeleteIcon from 'react-icons/lib/go/x';

const CourseChapterList = ({ name, id }) => {
  return (
    <div>
      <ListGroupItem style={{textAlign:"left"}}>
        <h4 style={{marginLeft:"15px"}}>{name}</h4>
        <DeleteIcon style={{float:"right", marginRight:"10px", fontSize:"16px", color:"#BF3309"}}/>
      </ListGroupItem>
    </div>
  );
};

CourseChapterList.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default CourseChapterList;
