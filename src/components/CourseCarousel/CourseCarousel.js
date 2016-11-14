import React, { PropTypes } from 'react';
import { Carousel } from 'react-bootstrap';
import styles from './styles.css';

const CourseCarousel = ({ courseName, index, direction, handleSelect }) => {
  return (
    <div>
      <h3 style={{marginLeft:"40px", color:"#B0B0B0"}}> {courseName} </h3>
      <Carousel indicators={false} activeIndex={index} direction={direction} onSelect={(i,e)=>handleSelect(i,e)} style={{backgroundColor:"#262228"}}>
        <Carousel.Item style={{width:"70%", margin:"auto"}}>
          <div className="chapter" style={{float:"left"}}><a target="_blank" href='http://www.stat.pitt.edu/stoffer/tsa4/intro_prob.pdf'>
            <img src="https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr02/2013/7/31/12/grid-cell-12788-1375287846-44.jpg"/>
            <h4>Chapter Title</h4></a>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

CourseCarousel.propTypes = {
  courseName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  direction: PropTypes.string,
  handleSelect: PropTypes.func.isRequired
};

export default CourseCarousel;
