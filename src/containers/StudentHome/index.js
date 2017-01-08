import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Modal, Popover, ButtonToolbar, OverlayTrigger, Form, FormControl, FormGroup, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Header from '../../components/Header';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import HeaderMenu from '../../components/MenuBar/HeaderMenu.js';
import SearchIcon from 'react-icons/lib/fa/search';
import CourseDisplay from '../../components/StudentLibrary/CourseDisplay';
import FolderDisplay from '../../components/StudentLibrary/FolderDisplay';
import SearchContent from '../../components/SearchContent';
import Collapsible from 'react-collapsible';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';
import * as actions from './actions.js';
import styles from './styles.css';


class StudentHome extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: '', newFolderName: ''};

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);
   this.handleFolderNameChange = this.handleFolderNameChange.bind(this);
   this.submitAddFolder = this.submitAddFolder.bind(this);
   this.onCourseSelect = this.onCourseSelect.bind(this);
   this.onFolderSelect = this.onFolderSelect.bind(this);
 }

 componentDidMount() {
   this.props.loadCourses();
   this.props.loadFolders();
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

 handleFolderNameChange(event) {
   this.setState({ newFolderName: event.target.value });
 }

 submitSearch(event) {
   event.preventDefault();
   this.props.search(this.state.searchValue);
 }

 submitAddFolder(event) {
   event.preventDefault();
   this.props.addFolder(this.state.newFolderName);
   this.setState({ newFolderName: '' });
 }

 onCourseSelect(event) {
   let newCourse;
   for(let course in this.props.courses) {
     if (this.props.courses[course].courseName === event.target.name) {
       newCourse = this.props.courses[course];
       break;
     }
   }
   this.props.selectCourse(newCourse);
 }

 onFolderSelect(event) {
   let newFolder;
   for(let folder in this.props.folders) {
     if (this.props.folders[folder].foldername === event.target.name) {
       newFolder = this.props.folders[folder];
       break;
     }
   }
   this.props.selectFolder(newFolder);
 }

 render() {
    const popoverTop = (
     <Popover id="popover-positioned-top" title="New Folder" style={{width:"300px"}}>
      <Form onSubmit={this.submitAddFolder}>
        <InputGroup>
          <FormControl type="text" label="name" value={this.state.newFolderName} placeholder="Folder Name" onChange={this.handleFolderNameChange} style={{width:"245px"}}/>
        </InputGroup>
      </Form>
     </Popover>
    );

    return (
      <div className="student-container">
        <Sidebar
          isProf={false}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={localStorage.getItem('userName')}
        />
        <HeaderMenu />

        <div id="librarybar-container" className="clearfix">
          <div id="library-menu">

          <Collapsible trigger="Courses" transitionTime={100} overflowWhenOpen='scroll' open={true}>
            <ListGroup style={{paddingLeft:"15px", paddingRight:"15px", marginTop:"-1px", minHeight:"40%"}}>
              {this.props.courses.map(course =>
                (course.courseName === this.props.selectedCourse.courseName && this.props.isCourseSelected) ? <ListGroupItem onClick={this.onCourseSelect} key={course.courseName} name={course.courseName} style={{borderTop:"none !important", color:"#1db954", fontSize:"15px"}}> {course.courseName}</ListGroupItem> :
                <ListGroupItem onClick={this.onCourseSelect} key={course.id} name={course.courseName} style={{fontSize:"14px"}}> {course.courseName}</ListGroupItem>
              )}
            </ListGroup>
          </Collapsible>

          <Collapsible trigger="Folders" transitionTime={100} overflowWhenOpen="auto" open={true}>
              { this.props.folders.length > 0 ?
              <ListGroup style={{paddingLeft:"15px", paddingRight:"15px", marginTop:"-1px", minHeight:"40%"}}>
                {this.props.folders.map(folder =>
                  (folder.foldername === this.props.selectedFolder.foldername && !this.props.isCourseSelected) ? <ListGroupItem onClick={this.onFolderSelect} key={folder.foldername} name={folder.foldername} style={{borderTop:"none !important", color:"#1db954", fontSize:"14px"}}>{folder.foldername}</ListGroupItem> :
                  <ListGroupItem onClick={this.onFolderSelect} key={folder.foldername} name={folder.foldername} style={{fontSize:"13px"}}>{folder.foldername}</ListGroupItem>
                )}
              </ListGroup>
              : <p id="none-tag" style={{textAlign:"center", marginTop:"15px"}}> You have no folders. Create folders to organize and manage your own selections of Chapters. </p>
              }
              <ButtonToolbar>
              <OverlayTrigger trigger="click" rootClose placement="top" overlay={popoverTop}>
                <Button id="addFolderBtn" style={{marginLeft:"40%"}}><AddIcon style={{color:"#1db954", fontSize:"26px"}}/></Button>
              </OverlayTrigger>
              </ButtonToolbar>
          </Collapsible>

          {/* <Collapsible trigger="All Chapters" transitionTime={100} overflowWhenOpen="auto">
          </Collapsible> */}
          </div>
          { this.props.courses.length > 0 ?
            this.props.isCourseSelected ?
            <div id="course-display">
                <CourseDisplay courseName={this.props.selectedCourse.courseName} chapters={this.props.selectedCourse.chapters}/>
            </div> :
            <div id="folder-display">
                <FolderDisplay folderName={this.props.selectedFolder.foldername} chapters={this.props.selectedFolder.chapters}/>
            </div> :
            <div style={{marginLeft:"23%", width:"60%", textAlign:"center"}}>
              <p style={{marginTop:"40px", textAlign:"center"}}> You are not currently subscribed to any courses. Search for courses to subscribe to them and view their content </p>
            </div>
        }


        </div>

        <Modal show={this.props.showSearchModal} onHide={this.props.closeSearchModal} style={{marginTop:"100px"}}>
          <Modal.Body>
            <Form onSubmit={this.submitSearch}>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={this.handleSearchChange}/>
                <InputGroup.Button>
                  <Button type="submit"> <SearchIcon style={{color:"#1db954"}}/> </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            </Form>
            <div id="search-content">
              <ListGroup>
                {this.props.searchContent.length > 0 ?
                  this.props.searchContent.map(chapterName =>
                    <SearchContent key={chapterName} chapterName={chapterName} />
                  ) : ''}
              </ListGroup>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

StudentHome.propTypes = {
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  searchModal: PropTypes.func.isRequired,
  closeSearchModal: PropTypes.func.isRequired,
  closeFolderModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  showFolderModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
  addFolder: PropTypes.func.isRequired,
  loadFolders: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired,
  isCourseSelected: PropTypes.bool.isRequired,
  selectFolder: PropTypes.func.isRequired,
  selectCourse: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    courses: state.studentReducer.courses,
    showSearchModal: state.studentReducer.showSearchModal,
    showFolderModal: state.studentReducer.showFolderModal,
    searchContent: state.studentReducer.searchContent,
    folders: state.studentReducer.folders,
    selectedFolder: state.studentReducer.selectedFolder,
    selectedCourse: state.studentReducer.selectedCourse,
    isCourseSelected: state.studentReducer.isCourseSelected
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCourses: () => dispatch(actions.loadCourses()),
    searchModal: () => dispatch(actions.searchModal()),
    folderModal: () => dispatch(actions.folderModal()),
    closeSearchModal: () => dispatch(actions.closeSearchModal()),
    closeFolderModal: () => dispatch(actions.closeFolderModal()),
    search: (searchValue) => dispatch(actions.search(searchValue)),
    addFolder: (folderName) => dispatch(actions.addFolder(folderName)),
    loadFolders: () => dispatch(actions.loadFolders()),
    selectFolder: (folder) => dispatch(actions.selectFolder(folder)),
    selectCourse: (course) => dispatch(actions.selectCourse(course))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(StudentHome);
