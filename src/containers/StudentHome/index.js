import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Carousel } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import Sidebar from '../../components/Sidebar';
import CourseCarousel from './CourseCarousel';

class StudentHome extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
    index : 0,
    direction : null
   }
 }

  render() {

    return (
      <div className="student-container">
          <Header showSearch hasUser/>
          <h2 style={{marginTop:"80px", marginLeft:"40px"}}> Welcome, Jake </h2>
          <CourseCarousel />
          <CourseCarousel />
          <CourseCarousel />
        <Header showSearch hasUser currentUser={this.props.currentUser}/>
      </div>
    );
  }
}

StudentHome.propTypes = {
  currentUser: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser
  };
}
export default connect(mapStateToProps)(StudentHome);
