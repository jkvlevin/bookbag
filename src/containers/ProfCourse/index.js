import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Modal, Form, FormGroup, FormControl, InputGroup, Button, Nav, NavItem } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import CourseChapterList from '../../components/ProfessorWorkbench/CourseChapterList.js';
import SearchIcon from 'react-icons/lib/fa/search';
import ChapterIcon from 'react-icons/lib/go/book';
import SettingsIcon from 'react-icons/lib/go/gear';
import AddIcon from 'react-icons/lib/go/plus';
import DeleteIcon from 'react-icons/lib/go/x';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfCourse extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchChaptersValue: '', showAddChapterModal: false };

   this.handleDeleteChapter = this.handleDeleteChapter.bind(this);

   this.showAddChapterModal = this.showAddChapterModal.bind(this);
   this.closeAddChapterModal = this.closeAddChapterModal.bind(this);
   this.handleChangeAddChapterTab = this.handleChangeAddChapterTab.bind(this);
   this.handleAddChapterToCourse = this.handleAddChapterToCourse.bind(this);

   this.handleSearchChaptersChange = this.handleSearchChaptersChange.bind(this);
   this.submitChaptersSearch = this.submitChaptersSearch.bind(this);

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
 }

 componentDidMount() {
   this.props.getCourseById(this.props.params.courseId);
 }

 handleDeleteChapter(event) {
   this.props.deleteChapter(event.target.name, this.props.currentCourse.courseInfo.id);
   this.props.getCourseById(this.props.currentCourse.courseInfo.id);
 }

 showAddChapterModal() {
   this.setState({ showAddChapterModal: true });
 }

 closeAddChapterModal() {
   this.setState({ showAddChapterModal: false });
 }

 handleChangeAddChapterTab(event) {
   this.props.changeAddChapterTab(event);
 }

 handleAddChapterToCourse(event) {
   this.props.addChapterToCourse(event.target.name, this.props.currentCourse.courseInfo.id);
 }

 handleSearchChaptersChange(event) {
   this.setState({ searchChaptersValue: event.target.value });
 }

 submitChaptersSearch(event) {
   event.preventDefault();
   this.props.searchChapters(this.state.searchChaptersValue);
 }


  handleCoursesClick() {
    browserHistory.push('/professor');
  }

  handleSearchClick() {
    this.props.searchModal();
  }

  handleSettingsClick() {
    alert('Settings');
  }



 render() {
    return (
      <div id="course-container">

        <Sidebar
          isProf={true}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={localStorage.getItem('userName')}
        />
        <h1 style={{marginLeft:"220px", marginTop:"25px", fontSize:"22px", color:"#878787"}}> {this.props.currentCourse.courseInfo.name} </h1>
        <p style={{marginLeft:"225px"}}> {this.props.currentCourse.courseInfo.description} </p>

        <div id="chapter-home-container">

          <div id="button-options">
            <div style={{display:"inline", marginTop:"10px", fontSize:"25px"}}><ChapterIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>{this.props.currentCourse.chapters ? this.props.currentCourse.chapters.length : 0}</h4></div>
            <div style={{display:"inline", marginLeft:"120px", marginTop:"10px", fontSize:"25px"}}><SettingsIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Settings</h4></div>
            <Button id="addchapter-button" onClick={this.showAddChapterModal}><AddIcon/><h4 id="addchapter-text">Add Chapter</h4></Button>
          </div>

          <div id="course-chapter-list">
            <ListGroup>
              {this.props.currentCourse.chapters.map(chapter =>
                <ListGroupItem key={chapter.id} style={{textAlign:"left"}}>
                  <a style={{marginLeft:"15px", float:"left"}}>{chapter.name}</a>
                  <p style={{marginLeft:"5px", marginTop:"2px", fontSize:"11px", display:"inline"}}> - {chapter.ownername} </p>
                  <p style={{display:"inline", marginLeft:"40px", fontSize:"11px", fontStyle:"italic"}}> "{chapter.description}" </p>
                  <Button onClick={this.handleDeleteChapter} id="del-chapter-button" name={chapter.id}> x </Button>
                </ListGroupItem>
              )}
            </ListGroup>
          </div>

          <Modal show={this.state.showAddChapterModal} onHide={this.closeAddChapterModal}>
           <Modal.Header closeButton>
             <Modal.Title>Add Chapter to {this.props.currentCourse.courseInfo.name}</Modal.Title>
           </Modal.Header>
           <Modal.Body>
             <Nav bsStyle="tabs" justified activeKey={this.props.activeAddChapterTab} onSelect={this.handleChangeAddChapterTab} style={{width:"60%", fontSize:"13px", marginLeft:"20%"}}>
               <NavItem eventKey={1}>My Library</NavItem>
               <NavItem eventKey={2}>Search All Chapters</NavItem>
             </Nav>
             { this.props.activeAddChapterTab === 1 ?
               <ListGroup style={{marginTop:"25px", width:"80%", marginLeft:"10%"}}>
                { this.props.publishedChapters.map(chapter =>
                  <ListGroupItem key={chapter.id}>{chapter.name}
                    <p style={{marginLeft:"2px", marginTop:"2px", fontSize:"11px", display:"inline"}}> - {chapter.ownername} </p>
                    <Button onClick={this.handleAddChapterToCourse} id="add-to-course-button" name={chapter.id}>+</Button>
                  </ListGroupItem>
                )}
                { this.props.workingChapters.map(chapter =>
                  <ListGroupItem key={chapter.id}>{chapter.name}
                    <p style={{marginLeft:"2px", marginTop:"2px", fontSize:"11px", display:"inline"}}> - {chapter.ownername} </p>
                    <Button onClick={this.handleAddChapterToCourse} id="add-to-course-button" name={chapter.id}>+</Button>
                  </ListGroupItem>
                )}
               </ListGroup> :
               <div style={{marginTop:"25px", width:"80%", marginLeft:"10%"}}>
                 <Form onSubmit={this.submitChaptersSearch}>
                 <FormGroup>
                   <InputGroup>
                     <FormControl type="text" value={this.state.searchChaptersValue} placeholder="Search" onChange={this.handleSearchChaptersChange}/>
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
                </div>
              }
              </Modal.Body>
            </Modal>

          {/* <Modal show={this.props.showSearchModal} onHide={this.props.closeSearchModal} style={{marginTop:"100px"}}>
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
          </Modal> */}

        </div>
      </div>
    );
  }
}

ProfCourse.propTypes = {
  searchModal: PropTypes.func.isRequired,
  closeSearchModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
  getCourseById: PropTypes.func.isRequired,
  currentCourse: PropTypes.object.isRequired,
  deleteChapter: PropTypes.func.isRequired,
  workingChapters: PropTypes.array.isRequired,
  publishedChapters: PropTypes.array.isRequired,
  addChapterToCourse: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    showSearchModal: state.courseReducer.showSearchModal,
    searchContent: state.courseReducer.searchContent,
    currentCourse: state.courseReducer.currentCourse,
    activeAddChapterTab: state.courseReducer.activeAddChapterTab,
    workingChapters: state.professorReducer.workingChapters,
    publishedChapters: state.professorReducer.publishedChapters
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchModal: () => dispatch(actions.searchModal()),
    closeSearchModal: () => dispatch(actions.closeSearchModal()),
    searchChapters: (searchValue) => dispatch(actions.searchChapters(searchValue)),
    getCourseById: (id) => dispatch(actions.getCourseById(id)),
    deleteChapter: (chapterId, courseId) => dispatch(actions.deleteChapter(chapterId, courseId)),
    changeAddChapterTab: (tab) => dispatch(actions.changeAddChapterTab(tab)),
    addChapterToCourse: (chapter, course) => dispatch(actions.addChapterToCourse(chapter, course))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfCourse);
