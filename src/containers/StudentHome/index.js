import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Modal, Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import Header from '../../components/Header';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import HeaderMenu from '../../components/MenuBar/HeaderMenu.js';
import Library from '../../components/Library/Library';
import SearchIcon from 'react-icons/lib/fa/search';
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
 }

 componentDidMount() {
   this.props.loadCourses();
 }

 handleCoursesClick() {
   browserHistory.push('/student');
 }

 handleBrowseClick() {
   alert('Browse');
 }

 handleSearchClick() {
   this.props.addCourseModal();
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

 render() {
    return (
      <div className="student-container">
        <Sidebar
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={this.props.currentUser}
        />
        <HeaderMenu currentUser={this.props.currentUser} />
        <Library courses={this.props.courses} selectedCourse={this.props.courses[0]} hasFolders={false}/>

        <Modal show={this.props.showModal} onHide={this.props.closeModal} animation={false} style={{marginTop:"100px"}}>
          <Modal.Body>
            <Form onSubmit={this.submitAddCourse}>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" value={this.state.addCourseName} placeholder="Search" onChange={this.handleACNChange}/>
                <InputGroup.Button>
                  <Button> <SearchIcon style={{color:"#2dbe60"}}/> </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            </Form>
            <div id="search-content">
              <h4> Search content goes here </h4>
            </div>
          </Modal.Body>
        </Modal>

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
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    courses: state.studentReducer.courses,
    showModal: state.studentReducer.showModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCourses: () => dispatch(actions.loadCourses()),
    addCourseModal: () => dispatch(actions.addCourseModal()),
    closeModal: () => dispatch(actions.closeModal()),
    addCourse: (email, name) => dispatch(actions.addCourse(email, name)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(StudentHome);
