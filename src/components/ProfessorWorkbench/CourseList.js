import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import ChaptersIcon from 'react-icons/lib/md/library-books';

const CourseList = ({ name, id, numChapters }) => {
  return (
    <div>
      <ListGroupItem style={{textAlign:"left"}}><h4 style={{marginLeft:"15px"}}>{name}</h4> <div style={{float:"right"}}><ChaptersIcon style={{marginRight:"5px", marginTop:"-3px", fontSize:"18px"}}/>{numChapters}</div></ListGroupItem>
    </div>
  );
};

CourseList.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  numChapters: PropTypes.number
};

export default CourseList;
