import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Carousel } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import Sidebar from '../../components/Sidebar';
import CourseCarousel from './CourseCarousel';
import * as actions from './actions.js';


class StudentHome extends React.Component {
  constructor(props) {
   super(props);
  //  this.state = {
  //   index : 0,
  //   direction : null
  //  }
 }

 componentDidMount() {
   this.props.loadCourses(this.props.currentUser);
 }

  render() {

    return (
      <div className="student-container">
        <Header showSearch hasUser currentUser={this.props.currentUser}/>
          <h2 style={{marginTop:"80px", marginLeft:"40px"}}> Welcome, Jake </h2>
          {/* <CourseCarousel />
          <CourseCarousel />
          <CourseCarousel /> */}
      </div>
    );
  }
}

StudentHome.propTypes = {
  currentUser: PropTypes.string.isRequired,
  courses: PropTypes.array.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    courses: state.studentReducer.courses
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCourses: (email) => dispatch(actions.loadCourses(email))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(StudentHome);
