import React, { PropTypes } from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import styles from './styles.css';


const CoursePanel = ({ selectedCourse }) => {
  return (
    <div id="coursepanel-container">
    <Grid>
      <h1> AAAAAAAAAAAAAAAAAAAAAAA </h1>
    </Grid>
    </div>
  );
};

CoursePanel.propTypes = {
  selectedCourse: PropTypes.string.isRequired,
};

export default CoursePanel;
