import React, { PropTypes } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import styles from './styles.css'


const Courselist = ({ courseName, selectedCourse }) => {
  const isSelected = (courseName === selectedCourse);
  return (
    <div>
      { isSelected ? <ListGroupItem key={courseName} style={{color:"#2DBE60", fontSize:"15px", fontWeight:"500"}}> {courseName}</ListGroupItem> : <ListGroupItem key={courseName} style={{color:"#878787", fontSize:"13px"}}> {courseName}</ListGroupItem> }
    </div>
  );
};

Courselist.propTypes = {
  courseName: PropTypes.string.isRequired,
  selectedCourse: PropTypes.string.isRequired
};

export default Courselist;
