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
import SubscribeIcon from 'react-icons/lib/md/library-add';
import * as actions from './actions.js';
import styles from './styles.css';


class StudentHome extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: '', newFolderName: '', selectedChapterToAdd: ''};

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);

   this.handleCourseSubscribe = this.handleCourseSubscribe.bind(this);
   this.handleAddToFolder = this.handleAddToFolder.bind(this);
   this.setSelectedChapterToAdd = this.setSelectedChapterToAdd.bind(this);
   this.handleRemoteAddToFolder = this.handleRemoteAddToFolder.bind(this);

   this.handleFolderNameChange = this.handleFolderNameChange.bind(this);
   this.submitAddFolder = this.submitAddFolder.bind(this);
   this.onCourseSelect = this.onCourseSelect.bind(this);
   this.onFolderSelect = this.onFolderSelect.bind(this);
 }

 componentDidMount() {
   this.props.loadCourses();
   this.props.loadFolders();
 }

 handleFolderNameChange(event) {
   this.setState({ newFolderName: event.target.value });
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

 handleCourseSubscribe(event) {
   this.props.subscribeToCourse(event.target.id);
 }

 logout() {
   localStorage.removeItem('userToken');
   localStorage.removeItem('userName');
   localStorage.removeItem('isProfessor');
   browserHistory.push('/');
 }

 handleCoursesClick() {
   browserHistory.push('/student');
 }

 handleSearchClick() {
   this.props.searchModal();
 }

 handleSearchChange(event) {
   this.setState({ searchValue: event.target.value });
 }

 submitSearch(event) {
   event.preventDefault();
   this.props.search(this.state.searchValue);
   this.setState({ searchValue: '' });
 }

 handleAddToFolder(event) {
   this.props.addToFolder(event.target.id, this.state.selectedChapterToAdd);
   this.setState({ selectedChapterToAdd: '' });
 }

 handleRemoteAddToFolder(chapter, folder) {
   this.props.addToFolder(chapter, folder);
 }

 setSelectedChapterToAdd(event) {
   this.setState({ selectedChapterToAdd: event.target.id });
 }

 render() {
    const folderPop = (
     <Popover id="folder-pop" title="New Folder" style={{width:"300px"}}>
      <Form onSubmit={this.submitAddFolder}>
        <InputGroup>
          <FormControl type="text" label="name" value={this.state.newFolderName} placeholder="Folder Name" onChange={this.handleFolderNameChange} style={{width:"245px"}}/>
        </InputGroup>
      </Form>
     </Popover>
    );

    const chapPop = (
      <Popover id="chap-pop" title="Add to Folder">
        { this.props.folders.length > 0 ?
          <ListGroup>
          { this.props.folders.map(folder =>
            <ListGroupItem key={folder.id} id={folder.id} onClick={this.handleAddToFolder} style={{borderTop:"none", marginTop:"1px", fontSize:"13px"}}>{folder.foldername}</ListGroupItem>
          )}
          </ListGroup>
        : ''}
      </Popover>
    );
    return (
      <div className="student-container">
        <HeaderMenu logout={this.logout} handleCoursesClick={this.handleCoursesClick} handleSearchClick={this.handleSearchClick}/>

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
              <OverlayTrigger trigger="click" rootClose placement="top" overlay={folderPop}>
                <Button id="addFolderBtn" style={{marginLeft:"40%"}}><AddIcon style={{color:"#1db954", fontSize:"26px"}}/></Button>
              </OverlayTrigger>
              </ButtonToolbar>
          </Collapsible>

          </div>

          { this.props.courses.length > 0 ?
            this.props.isCourseSelected ?
            <div id="course-display">
                <CourseDisplay courseName={this.props.selectedCourse.courseName} description={this.props.selectedCourse.description} folders={this.props.folders} chapters={this.props.selectedCourse.chapters} addToFolder={this.handleRemoteAddToFolder}/>
            </div> :
            <div id="folder-display">
                <FolderDisplay folderName={this.props.selectedFolder.foldername} description={this.props.selectedFolder.description} folders={this.props.folders} chapters={this.props.selectedFolder.chapters} addToFolder={this.handleRemoteAddToFolder}/>
            </div> :
            <div style={{textAlign:"center"}}>
              <p style={{marginTop:"40px"}}> You are not currently subscribed to any courses. Search for courses to subscribe to them and view their content </p>
              <Form onSubmit={this.submitSearch} style={{marginTop:"60px"}}>
              <FormGroup>
                <InputGroup style={{width:"40%", marginLeft:"40%"}}>
                  <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={this.handleSearchChange}/>
                  <InputGroup.Button>
                    <Button type="submit"> <SearchIcon style={{color:"#407dc6"}}/> </Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
              </Form>
              <div id="search-content">
                { this.props.searchContentCourses.length > 0 || this.props.searchContentChapters.length > 0 ?
                  <div style={{marginLeft:"400px", marginTop:"30px", width:"60%", minHeight:"50vh", border:"thin solid #BFBFBF", borderRadius:"15px"}}>
                    { this.props.searchContentChapters.length > 0 ?
                      <div style={{marginTop:"25px"}}>
                        <h5>Chapters</h5>
                        <ListGroup>
                          {this.props.searchContentChapters.map(chapter =>
                            <ListGroupItem key={chapter.id} style={{borderBottom:"none", width:"80%", marginLeft:"10%"}}>
                              <p style={{display:"inline"}}>{chapter.name} - </p>
                              <p style={{display:"inline", fontSize:"12px", marginLeft:"5px", fontStyle:"italic"}}>{chapter.ownername}</p>
                              <OverlayTrigger trigger="click" rootClose placement="right" overlay={chapPop}>
                                <Button id={chapter.id} onClick={this.setSelectedChapterToAdd} style={{float:"right", marginTop:"-7px", background:"none", border:"none", color:"#1db954", fontWeight:"bold", fontSize:"16px"}}>...</Button>
                              </OverlayTrigger>
                            </ListGroupItem>
                          )}
                        </ListGroup>
                      </div> : ''
                    }
                    { this.props.searchContentCourses.length > 0 ?
                      <div style={{marginTop:"30px"}}>
                        <h5>Courses</h5>
                        <ListGroup>
                          {this.props.searchContentCourses.map(course =>
                            <ListGroupItem key={course.id} style={{borderBottom:"none", width:"80%", marginLeft:"10%"}}>
                              <p style={{display:"inline"}}>{course.name} - </p>
                              <p style={{display:"inline", fontSize:"12px", marginLeft:"5px", fontStyle:"italic"}}>{course.profname}</p>
                              <Button onClick={this.handleCourseSubscribe} id={course.id} style={{float:"right", marginTop:"-7px", background:"none", border:"none", color:"#1db954", fontWeight:"bold", fontSize:"16px"}}>+</Button>
                            </ListGroupItem>
                          )}
                        </ListGroup>
                      </div> : ''
                    }
                  </div> : ''}
              </div>
            </div>
          }

        </div>

        <Modal show={this.props.showSearchModal} onHide={this.props.closeSearchModal} style={{marginTop:"23px"}}>
          <Modal.Header closeButton style={{backgroundColor:"#262228", color:"white"}}>
            <Modal.Title>Search BookBag Library</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.submitSearch}>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={this.handleSearchChange}/>
                <InputGroup.Button>
                  <Button type="submit"> <SearchIcon style={{color:"#407cd6"}}/> </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            </Form>
            <div id="search-content">
              { this.props.searchContentCourses.length > 0 || this.props.searchContentChapters.length > 0 ?
                <div>
                  { this.props.searchContentChapters.length > 0 ?
                    <div>
                      <h5>Chapters</h5>
                      <ListGroup>
                        {this.props.searchContentChapters.map(chapter =>
                          <ListGroupItem key={chapter.id}>
                            <p style={{display:"inline"}}>{chapter.name} - </p>
                            <p style={{display:"inline", fontSize:"12px", marginLeft:"5px", fontStyle:"italic"}}>{chapter.ownername}</p>
                            <OverlayTrigger trigger="click" rootClose placement="right" overlay={chapPop}>
                              <Button id={chapter.id} onClick={this.setSelectedChapterToAdd} style={{float:"right", marginTop:"-7px", background:"none", border:"none", color:"#1db954", fontWeight:"bold", fontSize:"16px"}}>...</Button>
                            </OverlayTrigger>
                          </ListGroupItem>
                        )}
                      </ListGroup>
                    </div> : ''
                  }
                  { this.props.searchContentCourses.length > 0 ?
                    <div>
                      <h5>Courses</h5>
                      <ListGroup>
                        {this.props.searchContentCourses.map(course =>
                          <ListGroupItem key={course.id} style={{borderBottom:"none", marginTop:"1px"}}>
                            <p style={{display:"inline"}}>{course.name} - </p>
                            <p style={{display:"inline", fontSize:"12px", marginLeft:"5px", fontStyle:"italic"}}>{course.profname}</p>
                            <Button onClick={this.handleCourseSubscribe} id={course.id} style={{float:"right", marginTop:"-7px", background:"none", border:"none", color:"#1db954", fontWeight:"bold", fontSize:"16px"}}>+</Button>
                          </ListGroupItem>
                        )}
                      </ListGroup>
                    </div> : ''
                  }
                </div> : ''}
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
  searchContentCourses: PropTypes.array.isRequired,
  searchContentChapters: PropTypes.array.isRequired,
  addFolder: PropTypes.func.isRequired,
  loadFolders: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired,
  isCourseSelected: PropTypes.bool.isRequired,
  selectFolder: PropTypes.func.isRequired,
  selectCourse: PropTypes.func.isRequired,
  subscribeToCourse: PropTypes.func.isRequired,
  addToFolder: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    courses: state.studentReducer.courses,
    showSearchModal: state.studentReducer.showSearchModal,
    showFolderModal: state.studentReducer.showFolderModal,
    searchContentCourses: state.studentReducer.searchContentCourses,
    searchContentChapters: state.studentReducer.searchContentChapters,
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
    selectCourse: (course) => dispatch(actions.selectCourse(course)),
    subscribeToCourse: (id) => dispatch(actions.subscribeToCourse(id)),
    addToFolder: (folder, chapter) => dispatch(actions.addToFolder(folder, chapter))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(StudentHome);
