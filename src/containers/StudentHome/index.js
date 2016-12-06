import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Modal, Form, FormControl, FormGroup, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Header from '../../components/Header';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import HeaderMenu from '../../components/MenuBar/HeaderMenu.js';
import SearchIcon from 'react-icons/lib/fa/search';
import Courselist from '../../components/StudentLibrary/Courselist';
import CourseDisplay from '../../components/StudentLibrary/CourseDisplay';
import Collapsible from 'react-collapsible';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';
import * as actions from './actions.js';
import styles from './styles.css';


class StudentHome extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: ''};

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
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
   this.props.searchModal();
 }

 handleSettingsClick() {
   alert('Settings');
 }

 handleSearchChange(event) {
   this.setState({ searchValue: event.target.value });
 }

 render() {
    const courseNames = [];
    for (let course in this.props.courses) {
      courseNames.push(this.props.courses[course].courseName);
    }
    let hasFolders = false;
    return (
      <div className="student-container">
        <Sidebar
          isProf={false}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={this.props.currentUser}
        />
        <HeaderMenu currentUser={this.props.currentUser} />
        <div id="librarybar-container" className="clearfix">
          <div id="library-menu">
          <Collapsible trigger="Courses" transitionTime={100} overflowWhenOpen='scroll' open={true}>
            <ListGroup style={{paddingLeft:"15px", paddingRight:"15px"}}>
              {courseNames.map(courseName =>
                <Courselist key={courseName} courseName={courseName} selectedCourse={this.props.courses[0].courseName} />
              )}
            </ListGroup>
          </Collapsible>
          <Collapsible trigger="Folders" transitionTime={100} overflowWhenOpen="auto">
            <div style={{textAlign:"center", marginTop:"20px", borderBottom:"thin solid #B0B0B0"}}>
              { hasFolders ?
              <ListGroup style={{paddingLeft:"15px", paddingRight:"15px"}}>

              </ListGroup>
              : <p id="none-tag"> You have no folders. Create folders to organize and manage your own selections of Chapters. </p>
              }
              <Button id="addFolderBtn"><AddIcon style={{color:"#30ad62", fontSize:"26px"}}/></Button>
            </div>
          </Collapsible>
          <Collapsible trigger="All Chapters" transitionTime={100} overflowWhenOpen="auto">
          </Collapsible>
          </div>

          <div id="course-display">
              <CourseDisplay courseName={this.props.courses[0].courseName} chapters={this.props.courses[0].chapters}/>
          </div>
        </div>

        <Modal show={this.props.showModal} onHide={this.props.closeModal} style={{marginTop:"100px"}}>
          <Modal.Body>
            <Form>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={this.handleSearchChange}/>
                <InputGroup.Button>
                  <Button> <SearchIcon style={{color:"#30ad62"}}/> </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            </Form>
            <div id="search-content">
              <h4> Search content goes here </h4>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

StudentHome.propTypes = {
  currentUser: PropTypes.string.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  searchModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
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
    searchModal: () => dispatch(actions.searchModal()),
    closeModal: () => dispatch(actions.closeModal()),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(StudentHome);
