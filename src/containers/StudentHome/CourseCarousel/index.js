import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Carousel } from 'react-bootstrap';
import styles from './styles.css';
import CourseTile from './CourseTile';

class CourseCarousel extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
    index : 0,
    direction : null
   }
   this.handleSearch = this.handleSearch.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
 }

  handleSearch() {
    browserHistory.push('/search');
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  render() {

    return (
      <div>
          <h3 style={{marginTop:"80px", marginLeft:"40px"}}> Kiddy Lit </h3>
          <Carousel indicators={false} activeIndex={this.state.index} direction={this.state.direction} onSelect={(i,e)=>this.handleSelect(i,e)} style={{backgroundColor:"#262228"}}>
            <Carousel.Item style={{width:"70%", margin:"auto"}}>
              <div className="chapter" style={{float:"left"}}><a href='http://www.stat.pitt.edu/stoffer/tsa4/intro_prob.pdf'>
                <img src="https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr02/2013/7/31/12/grid-cell-12788-1375287846-44.jpg"/>
                <h4>Chapter Title</h4></a>
              </div>
            </Carousel.Item>
            </Carousel>
      </div>
    );
  }
}

CourseCarousel.propTypes = {
  currentUser: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser
  };
}
export default connect(mapStateToProps)(CourseCarousel);
