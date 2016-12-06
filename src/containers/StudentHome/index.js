import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Modal, Popover, ButtonToolbar, OverlayTrigger, Form, FormControl, FormGroup, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Header from '../../components/Header';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import HeaderMenu from '../../components/MenuBar/HeaderMenu.js';
import SearchIcon from 'react-icons/lib/fa/search';
import Courselist from '../../components/StudentLibrary/Courselist';
import FolderList from '../../components/FolderList';
import CourseDisplay from '../../components/StudentLibrary/CourseDisplay';
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
              { this.props.folders.length > 0 ?
              <ListGroup style={{paddingLeft:"15px", paddingRight:"15px"}}>
                <ListGroup>
                  {this.props.folders.map(folder =>
                    <FolderList key={folder.folderName} folderName={folder.folderName} />
                  )}
                </ListGroup>
              </ListGroup>
              : <p id="none-tag"> You have no folders. Create folders to organize and manage your own selections of Chapters. </p>
              }
              <ButtonToolbar>
              <OverlayTrigger trigger="click" rootClose placement="top" overlay={popoverTop}>
                <Button id="addFolderBtn" style={{marginLeft:"40%"}}><AddIcon style={{color:"#30ad62", fontSize:"26px"}}/></Button>
              </OverlayTrigger>
              </ButtonToolbar>
            </div>
          </Collapsible>
          <Collapsible trigger="All Chapters" transitionTime={100} overflowWhenOpen="auto">
          </Collapsible>
          </div>

          <div id="course-display">
              <CourseDisplay courseName={this.props.courses[0].courseName} chapters={this.props.courses[0].chapters}/>
          </div>
        </div>

        <Modal show={this.props.showSearchModal} onHide={this.props.closeSearchModal} style={{marginTop:"100px"}}>
          <Modal.Body>
            <Form onSubmit={this.submitSearch}>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={this.handleSearchChange}/>
                <InputGroup.Button>
                  <Button type="submit"> <SearchIcon style={{color:"#cb6a99"}}/> </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            </Form>
            <div id="search-content">
              <ListGroup>
                {this.props.searchContent.map(chapterName =>
                  <SearchContent key={chapterName} chapterName={chapterName} />
                )}
              </ListGroup>
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
  closeSearchModal: PropTypes.func.isRequired,
  closeFolderModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  showFolderModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
  addFolder: PropTypes.func.isRequired,
  loadFolders: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    courses: state.studentReducer.courses,
    showSearchModal: state.studentReducer.showSearchModal,
    showFolderModal: state.studentReducer.showFolderModal,
    searchContent: state.studentReducer.searchContent,
    folders: state.studentReducer.folders
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
    loadFolders: () => dispatch(actions.loadFolders())
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(StudentHome);
