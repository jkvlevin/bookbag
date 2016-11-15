import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Modal, Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import Header from '../../components/Header';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import HeaderMenu from '../../components/MenuBar/HeaderMenu.js';
import LibraryBar from '../../components/Library/LibraryBar';
import CoursePanel from '../../components/CoursePanel/CoursePanel.js'
import * as actions from './actions.js';
import styles from './styles.css';


class StudentHome extends React.Component {
  constructor(props) {
   super(props);

   this.state = { addCourseName: '', index: 0, direction: null};

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleACNChange = this.handleACNChange.bind(this);
   this.submitAddCourse = this.submitAddCourse.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
 }

 componentDidMount() {
   this.props.loadCourses(this.props.currentUser);
 }

 handleCoursesClick() {
   browserHistory.push('/student');
 }

 handleBrowseClick() {
   alert('Browse');
 }

 handleSearchClick() {
   alert('Search');
 }

 handleSettingsClick() {
   alert('Settings');
 }

 handleACNChange(event) {
   this.setState({ addCourseName: event.target.value });
 }

 submitAddCourse(event) {
   event.preventDefault();
   this.props.addCourse(this.props.currentUser, this.state.addCourseName);
   this.setState({ addCourseName: ''});
   this.props.closeModal();
 }

 handleSelect(selectedIndex, e) {
   this.setState({
     index: selectedIndex,
     direction: e.direction
   });
 }

 render() {

    return (
      <div className="student-container">
        <Sidebar
          courseNames={this.props.courseNames}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          addCourseModal={this.props.addCourseModal}
          userName={this.props.currentUser}
        />
        <HeaderMenu currentUser={this.props.currentUser} />
        <LibraryBar courseNames={this.props.courseNames} selectedCourse={this.props.courseNames[0]} hasFolders={false}/>
        <CoursePanel selectedCourse={this.props.courseNames[0]} />
        {/* <Modal show={this.props.showModal} onHide={this.props.closeModal} style={{marginTop:"100px"}}>
            <Modal.Header closeButton>
              <Modal.Title style={{textAlign:"center"}}>Create Course</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Form onSubmit={this.submitAddCourse}>
            <FormGroup>
              <label>Name</label>
              <FormControl type="text" value={this.state.addCourseName} placeholder="New Course" onChange={this.handleACNChange}/>
              <label style={{marginTop:"15px"}}>Description</label>
              <FormControl style={{height:"100px"}} componentClass="textarea" placeholder="Give your course a memorable description" />
            </FormGroup>
            <FormGroup style={{textAlign:"center"}}>
            <Button className="modal-button" style={{width:"100px", borderRadius:"20px"}} onClick={this.props.closeModal}>Cancel</Button>
            <Button className="modal-button" style={{width:"100px", borderRadius:"20px", backgroundColor:"#008800", marginLeft:"20px", color:"white"}} onClick={this.submitAddCourse}>Save</Button>
            </FormGroup>
            </Form>
          </Modal.Body>
        </Modal> */}

      </div>
    );
  }
}

StudentHome.propTypes = {
  currentUser: PropTypes.string.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  addCourseModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  addCourse: PropTypes.func.isRequired,
  courseNames: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    courses: state.studentReducer.courses,
    showModal: state.studentReducer.showModal,
    courseNames: state.studentReducer.courseNames
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCourses: (email) => dispatch(actions.loadCourses(email)),
    addCourseModal: () => dispatch(actions.addCourseModal()),
    closeModal: () => dispatch(actions.closeModal()),
    addCourse: (email, name) => dispatch(actions.addCourse(email, name)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(StudentHome);
