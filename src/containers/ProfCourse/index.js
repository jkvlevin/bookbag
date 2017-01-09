import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Modal, Form, FormGroup, FormControl, ControlLabel, InputGroup, Button, Nav, NavItem } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import CourseChapterList from '../../components/ProfessorWorkbench/CourseChapterList.js';
import SearchIcon from 'react-icons/lib/fa/search';
import ChapterIcon from 'react-icons/lib/go/book';
import SettingsIcon from 'react-icons/lib/go/gear';
import AddIcon from 'react-icons/lib/go/plus';
import DeleteIcon from 'react-icons/lib/go/x';
import PublishIcon from 'react-icons/lib/md/publish';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfCourse extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchChaptersValue: '', showAddChapterModal: false, showChapters:true };

   this.handleDeleteChapter = this.handleDeleteChapter.bind(this);

   this.showAddChapterModal = this.showAddChapterModal.bind(this);
   this.closeAddChapterModal = this.closeAddChapterModal.bind(this);
   this.handleChangeAddChapterTab = this.handleChangeAddChapterTab.bind(this);
   this.handleAddChapterToCourse = this.handleAddChapterToCourse.bind(this);

   this.handleSearchChaptersChange = this.handleSearchChaptersChange.bind(this);
   this.submitChaptersSearch = this.submitChaptersSearch.bind(this);

   this.showChapters = this.showChapters.bind(this);
   this.showSettings = this.showSettings.bind(this);

   this.handleWorkbenchClick = this.handleWorkbenchClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.logout = this.logout.bind(this);
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
   this.setState({ showAddChapterModal: false, searchChaptersValue: '' });
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

 showChapters() {
   this.setState({ showChapters:true });
 }

 showSettings() {
   this.setState({ showChapters:false });
 }

  handleWorkbenchClick() {
    browserHistory.push('/professor');
  }

  handleSearchClick() {
    this.props.searchModal();
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('isProfessor');
    browserHistory.push('/');
  }



 render() {
    return (
      <div id="course-container">

        <Sidebar
          handleWorkbenchClick={this.handleWorkbenchClick}
          handleSearchClick={this.handleSearchClick}
          logout={this.logout}
          userName={localStorage.getItem('userName')}
        />
        <h1 style={{marginLeft:"220px", marginTop:"25px", fontSize:"22px", color:"#878787"}}> {this.props.currentCourse.courseInfo.name} </h1>
        <p style={{marginLeft:"235px", fontSize:"11px"}}> "{this.props.currentCourse.courseInfo.description}" </p>

          <div id="button-options">
            <Button id="show-chapters-btn" onClick={this.showChapters}><ChapterIcon onClick={this.showChapters} style={{color:"#407dc6"}}/><h4 onClick={this.showChapters} id="showchap-text">Course Chapters</h4></Button>
            <Button id="addchapter-button" onClick={this.showAddChapterModal}><AddIcon style={{color:"#1db954"}}/><h4 id="addchapter-text">Add Chapter</h4></Button>
            <Button id="show-settings-btn" onClick={this.showSettings}><SettingsIcon onClick={this.showSettings}/><h4 onClick={this.showSettings} id="settings-text">Settings</h4></Button>
          </div>

          { this.state.showChapters ?
            this.props.currentCourse.chapters.length > 0 ?
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
            </div> :
            <div id="course-chapter-list">
              <p style={{marginLeft:"35%", marginTop:"100px"}}>Add chapters to start creating your course!</p>
            </div> :
          <div id="course-settings">
            <Form style={{width:"60%", marginLeft:"30px", marginTop:"30px", float:"left"}}>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl type="text" value={this.props.currentCourse.courseInfo.name} title="Name" name="name"/>
                <ControlLabel style={{marginTop:"15px"}}>Description</ControlLabel>
                <FormControl componentClass="textarea" value={this.props.currentCourse.courseInfo.description} title="Description" name="description" style={{minHeight:"40px"}} />
                <ControlLabel style={{marginTop:"15px"}}>Keywords</ControlLabel>
                <FormControl componentClass="textarea" value={this.props.currentCourse.courseInfo.keywords} title="Keywords" name="keywords" style={{minHeight:"40px"}}/>
                <Button type="submit" style={{marginLeft:"30%", marginTop:"25px", backgroundColor:"#1db954", color:"white", borderRadius:"20px", width:"150px"}}>Save Changes</Button>
              </FormGroup>
            </Form>
            {this.props.currentCourse.courseInfo.public ? '' :
              <div>
                <PublishIcon style={{display:"inline", marginLeft:"150px", marginTop:"10%", fontSize:"50px", color:"#1db954", border:"thin solid #1db954", borderRadius:"25px"}}/> <br /><br />
                <h4 id="publish-text">Publish</h4> <br />
                <h7 style={{display:"inline", fontSize:"11px", marginLeft:"5%"}}>Warning: this will make your course publicly available</h7>
              </div>}
          </div>
          }

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
                   <ListGroup style={{overflow:"auto"}}>
                     {this.props.searchChaptersResult.length > 0 ?
                       this.props.searchChaptersResult.map(chapter =>
                         <ListGroupItem key={chapter.id}>{chapter.name}
                           <p style={{marginLeft:"2px", marginTop:"2px", fontSize:"11px", display:"inline"}}> - {chapter.ownername} </p>
                           <Button onClick={this.handleAddChapterToCourse} id="add-to-course-button" name={chapter.id}>+</Button>
                         </ListGroupItem>
                       ) :
                       this.props.hasSearched ? <p>No chapters found</p> : ''
                     }
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
  addChapterToCourse: PropTypes.func.isRequired,
  searchChaptersResult: PropTypes.array,
  hasSearched: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    showSearchModal: state.courseReducer.showSearchModal,
    searchContent: state.courseReducer.searchContent,
    currentCourse: state.courseReducer.currentCourse,
    activeAddChapterTab: state.courseReducer.activeAddChapterTab,
    workingChapters: state.professorReducer.workingChapters,
    publishedChapters: state.professorReducer.publishedChapters,
    searchChaptersResult: state.courseReducer.searchChaptersResult,
    hasSearched: state.courseReducer.hasSearched
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
