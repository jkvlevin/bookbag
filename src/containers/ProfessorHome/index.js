import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Nav, NavItem, Table, Button, DropdownButton, MenuItem, Glyphicon, Modal, Popover, ButtonToolbar, OverlayTrigger, Form, FormControl, FormGroup, ControlLabel, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import SearchIcon from 'react-icons/lib/fa/search';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';
import UserIcon from 'react-icons/lib/fa/user';
import ChaptersIcon from 'react-icons/lib/go/book';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfessorHome extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: '',
    showNewChapterModal: false, newChapterName: '', newChapterDescription: '', newChapterKeywords:'', newChapterCheckout:3,
    showNewCourseModal: false, newCourseName: '', newCourseDescription: '', newCourseKeywords: '',
   };

   this.handleNewChapterChange = this.handleNewChapterChange.bind(this);
   this.submitNewChapterForm = this.submitNewChapterForm.bind(this);
   this.openNewChapterModal = this.openNewChapterModal.bind(this);
   this.closeNewChapterModal = this.closeNewChapterModal.bind(this);

   this.handleNewCourseChange = this.handleNewCourseChange.bind(this);
   this.submitNewCourseForm = this.submitNewCourseForm.bind(this);
   this.openNewCourseModal = this.openNewCourseModal.bind(this);
   this.closeNewCourseModal = this.closeNewCourseModal.bind(this);

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
 }

 componentDidMount() {
   this.props.loadProfessorChapters();
   this.props.loadProfessorCourses();
 }

  openNewChapterModal() {
    this.setState({ showNewChapterModal: true });
  }

  closeNewChapterModal() {
    this.setState({ showNewChapterModal: false, newChapterName: '', newChapterDescription: '', newChapterKeywords: '', newChapterCheckout:3 });
  }

 handleNewChapterChange(event) {
   if (event.target.name === "name") {
     this.setState({ newChapterName: event.target.value });
   } else if (event.target.name === "description") {
     this.setState({ newChapterDescription: event.target.value });
   } else if (event.target.name === "checkout") {
     this.setState({ newChapterCheckout: event.target.value });
   } else if (event.target.name === "keywords") {
     this.setState({ newChapterKeywords: event.target.value });
   }
 }

 submitNewChapterForm() {
   this.props.submitNewChapter(this.state.newChapterName, this.state.newChapterDescription, this.state.newChapterKeywords, this.state.newChapterCheckout);
   this.closeNewChapterModal();
 }

 handleNewCourseChange(event) {
   if (event.target.name === "name") {
     this.setState({ newCourseName: event.target.value });
   } else if (event.target.name === "description") {
     this.setState({ newCourseDescription: event.target.value });
   } else if (event.target.name === "keywords") {
     this.setState({ newCourseKeywords: event.target.value });
   }
 }

 submitNewCourseForm() {
   this.props.submitNewCourse(this.state.newCourseName, this.state.newCourseDescription, this.state.newCourseKeywords);
   this.closeNewCourseModal();
 }

 openNewCourseModal() {
   this.setState({ showNewCourseModal: true });
 }

 closeNewCourseModal() {
   this.setState({ showNewCourseModal: false, newCourseName: '', newCourseDescription: '', newCourseKeywords: '' });
 }

 handleSelectChapter(event) {
   if (event.target.id) {
     const id = event.target.id;
     const name = event.target.name;
     browserHistory.push('/chapter/' + name + '/' + id);
   }
 }

 handleSelectCourse(event) {
   if (event.target.id && event.target.name) {
     const id = event.target.id;
     const name = event.target.name;
     browserHistory.push('/course/' + name + '/' + id);
   }
 }

  handleCoursesClick() {
    browserHistory.push('/professor');
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
  submitSearch(event) {
    event.preventDefault();
    this.props.search(this.state.searchValue);
  }

  handleSelect(event) {
    this.props.switchTabs(event);
  }

 render() {
    return (
      <div id="prof-container">
        <Sidebar
          isProf={true}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={localStorage.getItem('userName')}
        />
        <h1 id="welcome-title"> Welcome back professor {localStorage.getItem('userName')} </h1>

        <div id="nav-container">
          <Nav bsStyle="tabs" justified activeKey={this.props.activeTab} onSelect={this.handleSelect} style={{width:"200px", marginTop:"25px", marginLeft:"39%", float:"left"}}>
            <NavItem eventKey={1}>Chapters</NavItem>
            <NavItem eventKey={2}>Courses</NavItem>
          </Nav>

          <DropdownButton id="add-button" noCaret title={<AddIcon style={{color:"#1db954", fontSize:"32px"}}/>}>
              <MenuItem eventKey="1" onClick={this.openNewChapterModal}>Create New Chapter</MenuItem>
              <MenuItem eventKey="2" onClick={this.openNewCourseModal}>Create New Course</MenuItem>
          </DropdownButton>
        </div>

        <Modal show={this.state.showNewChapterModal} onHide={this.closeNewChapterModal}>
         <Modal.Header closeButton>
           <Modal.Title>Create New Chapter</Modal.Title>
         </Modal.Header>
         <Modal.Body>
         <Form onSubmit={this.submitNewChapterForm}>
         <FormGroup>
           <ControlLabel>Name</ControlLabel>
           <FormControl type="text" value={this.state.newChapterName} name="name" onChange={this.handleNewChapterChange} placeholder="Name" />
           <ControlLabel style={{marginTop:"15px"}}>Description</ControlLabel>
           <FormControl componentClass="textarea" value={this.state.newChapterDescription} name="description" onChange={this.handleNewChapterChange} placeholder="Give your chapter a helpful description" style={{minHeight:"50px"}} />
           <ControlLabel style={{marginTop:"15px"}}>Keywords</ControlLabel> <ControlLabel style={{marginTop:"15px", marginLeft:"55%"}}>Checkout Time (hours)</ControlLabel>
           <FormControl componentClass="textarea" value={this.state.newChapterKeywords} name="keywords" onChange={this.handleNewChapterChange} placeholder="Give your chapter any relevant keywords seperated by commas. Eg. 'new', 'chapter'" style={{minHeight:"70px", width:"60%", float:"left"}}/>
           <FormControl type="number" value={this.state.newChapterCheckout} name="checkout" onChange={this.handleNewChapterChange} min={1} max={24} style={{width:"70px", display:"inline", marginLeft:"8%"}}/>
         </FormGroup>
         </Form>
         </Modal.Body>
         <Modal.Footer style={{textAlign:"center", marginTop:"5%"}}>
          <Button onClick={this.closeNewChapterModal} style={{width:"100px", borderRadius:"20px"}}>Cancel</Button>
          <Button style={{backgroundColor:"#1db954", color:"white", width:"100px", borderRadius:"20px", marginLeft:"15px"}} onClick={this.submitNewChapterForm}>Create</Button>
         </Modal.Footer>
       </Modal>

       <Modal show={this.state.showNewCourseModal} onHide={this.closeNewCourseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={this.submitNewCourseForm}>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl type="text" value={this.state.newCourseName} title="Name" name="name" onChange={this.handleNewCourseChange} placeholder="New Course" />
          <ControlLabel style={{marginTop:"15px"}}>Description</ControlLabel>
          <FormControl componentClass="textarea" value={this.state.newCourseDescription} title="Description" name="description" onChange={this.handleNewCourseChange} placeholder="Give your course a helpful description" style={{minHeight:"50px"}} />
          <ControlLabel style={{marginTop:"15px"}}>Keywords</ControlLabel>
          <FormControl componentClass="textarea" value={this.state.newCourseKeywords} title="Keywords" name="keywords" onChange={this.handleNewCourseChange} placeholder="Give your course any relevant keywords seperated by commas. Eg. 'new', 'course'" style={{minHeight:"70px"}}/>
        </FormGroup>
        </Form>
        </Modal.Body>
        <Modal.Footer style={{textAlign:"center"}}>
         <Button onClick={this.closeNewCourseModal} style={{width:"100px", borderRadius:"20px"}}>Cancel</Button>
         <Button style={{backgroundColor:"#1db954", color:"white", width:"100px", borderRadius:"20px", marginLeft:"15px"}} onClick={this.submitNewCourseForm}>Create</Button>
        </Modal.Footer>
      </Modal>

        <div id="workbench-home-container">

        {this.props.activeTab == 1 ?
          <div style={{marginTop:"35px", marginLeft:"5%"}}>
            <div id="in-progress">
              <h4>In Progress</h4>
              {this.props.workingChapters.map(chapter =>
                <ListGroupItem key={chapter.id} style={{textAlign:"left"}} id={chapter.id} name={chapter.name} onClick={this.handleSelectChapter}>
                  {chapter.name}<div style={{float:"right"}} id={chapter.id} name={chapter.name} onClick={this.handleSelectChapter}><UserIcon style={{marginRight:"5px", marginTop:"-3px", fontSize:"18px"}}/>{chapter.contributors ? chapter.contributors.length : 0}</div>
                </ListGroupItem>
              )}
            </div>
            <div id="published">
              <h4>Published</h4>
              {this.props.publishedChapters.map(chapter =>
                <ListGroupItem key={chapter.id} style={{textAlign:"left"}} id={chapter.id} name={chapter.name} onClick={this.handleSelectChapter}>
                  {chapter.name}<div style={{float:"right"}} id={chapter.id} name={chapter.name} onClick={this.handleSelectChapter}><UserIcon style={{marginRight:"5px", marginTop:"-3px", fontSize:"18px"}}/>{chapter.contributors ? chapter.contributors.length : 0}</div>
                </ListGroupItem>
              )}
            </div>
            </div> :
            <div style={{marginTop:"35px", marginLeft:"5%"}}>
              <div id="in-progress">
                <h4> In Progress</h4>
                {this.props.workingCourses.map(course =>
                  <ListGroupItem key={course.courseInfo.id} style={{textAlign:"left"}} id={course.courseInfo.id} name={course.courseInfo.name} onClick={this.handleSelectCourse}>
                    {course.courseInfo.name}<div style={{float:"right"}} id={course.courseInfo.id} name={course.courseInfo.name} onClick={this.handleSelectCourse}><ChaptersIcon style={{marginRight:"5px", marginTop:"-3px", fontSize:"18px"}}/>{course.chapters ? course.chapters.length : 0}</div>
                  </ListGroupItem>
                )}
              </div>
              <div id="published">
                <h4>Published</h4>
                {this.props.publishedCourses.map(course =>
                  <ListGroupItem key={course.courseInfo.id} style={{textAlign:"left"}} id={course.courseInfo.id} name={course.courseInfo.name} onClick={this.handleSelectCourse}>
                    {course.courseInfo.name}<div style={{float:"right"}} id={course.courseInfo.id} name={course.courseInfo.name} onClick={this.handleSelectCourse}><ChaptersIcon style={{marginRight:"5px", marginTop:"-3px", fontSize:"18px"}}/>{course.chapters ? course.chapters.length: 0}</div>
                  </ListGroupItem>
                )}
              </div>
            </div>}

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
      </div>
    );
  }
}

ProfessorHome.propTypes = {
  searchModal: PropTypes.func.isRequired,
  closeSearchModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
  submitNewChapter: PropTypes.func.isRequired,
  loadProfessorChapters: PropTypes.func.isRequired,
  workingChapters: PropTypes.array.isRequired,
  publishedChapters: PropTypes.array.isRequired,
  workingCourses: PropTypes.array.isRequired,
  publishedCourses: PropTypes.array.isRequired,
  submitNewCourse: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    activeTab: state.professorReducer.activeTab,
    showSearchModal: state.professorReducer.showSearchModal,
    searchContent: state.professorReducer.searchContent,
    workingChapters: state.professorReducer.workingChapters,
    publishedChapters: state.professorReducer.publishedChapters,
    workingCourses: state.professorReducer.workingCourses,
    publishedCourses: state.professorReducer.publishedCourses
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProfessorChapters: () => dispatch(actions.loadProfessorChapters()),
    loadProfessorCourses: () => dispatch(actions.loadProfessorCourses()),
    submitNewChapter: (name, description, keywords, checkoutTime) => dispatch(actions.submitNewChapter(name, description, keywords, checkoutTime)),
    submitNewCourse: (name, description, keywords) => dispatch(actions.submitNewCourse(name, description, keywords)),
    switchTabs: (tab) => dispatch(actions.switchTabs(tab)),
    searchModal: () => dispatch(actions.searchModal()),
    closeSearchModal: () => dispatch(actions.closeSearchModal()),
    search: (searchValue) => dispatch(actions.search(searchValue)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfessorHome);
