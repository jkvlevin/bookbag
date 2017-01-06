import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Nav, NavItem, Table, Button, DropdownButton, MenuItem, Glyphicon, Modal, Popover, ButtonToolbar, OverlayTrigger, Form, FormControl, FormGroup, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import SearchIcon from 'react-icons/lib/fa/search';
import ChapterList from '../../components/ProfessorWorkbench/ChapterList.js';
import CourseList from '../../components/ProfessorWorkbench/CourseList.js';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfessorHome extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: ''};

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);

   this.handleSelect = this.handleSelect.bind(this);
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
   const chaptersPublished = [{
     id: "1",
     name: "Variance",
     numContributors: 2
   },
   {
     id: "2",
     name: "Computability",
     numContributors: 3
   },
   {
     id: "5",
     name: "Plato's Finest",
     numContributors: 4
   }];
   const chaptersInProgress = [{
     id: "3",
     name: "Boobs",
     numContributors: 1
   },
   {
     id: "4",
     name: "Algorithmic Design",
     numContributors: 3
   }];
   const coursesPublished = [{
     id: "1",
     name: "COS 126",
     numChapters: 18
   },
   {
     id: "2",
     name: "PHI 205",
     numChapters: 25
   }];
   const coursesInProgress = [{
     id: "3",
     name: "Boobs",
     numChapters: 69
   },
   {
     id: "4",
     name: "COS 340",
     numChapters: 21
   }];
    return (
      <div id="prof-container">
        <Sidebar
          isProf={true}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={this.props.currentUser}
        />
        <h1 style={{marginLeft:"220px", marginTop:"25px", fontSize:"22px", color:"#878787"}}> Welcome back Professor Levin </h1>

        <div id="nav-container">
          <Nav bsStyle="tabs" justified activeKey={this.props.activeTab} onSelect={this.handleSelect} style={{width:"200px", marginTop:"25px", marginLeft:"39%", float:"left"}}>
            <NavItem eventKey={1}>Chapters</NavItem>
            <NavItem eventKey={2}>Courses</NavItem>
          </Nav>

          <DropdownButton id="add-button" noCaret dropup title={<AddIcon style={{color:"#1db954", fontSize:"32px"}}/>}>
              <MenuItem eventKey="1">Create New Chapter</MenuItem>
              <MenuItem eventKey="2">Create New Course</MenuItem>
          </DropdownButton>
        </div>

        <div id="workbench-home-container">

        {this.props.activeTab == 1 ?
          <div style={{marginTop:"35px", marginLeft:"5%"}}>
            <div id="in-progress">
              <h4>In Progress</h4>
              {chaptersInProgress.map(chapter =>
                <ChapterList key={chapter.id} name={chapter.name} id={chapter.id} numContributors={chapter.numContributors}></ChapterList>
              )}
            </div>
            <div id="published">
              <h4>Published</h4>
              {chaptersPublished.map(chapter =>
                <ChapterList key={chapter.id} name={chapter.name} id={chapter.id} numContributors={chapter.numContributors}></ChapterList>
              )}
            </div>
            </div> :
            <div style={{marginTop:"35px", marginLeft:"5%"}}>
              <div id="in-progress">
                <h4> In Progress</h4>
                {coursesInProgress.map(course =>
                  <CourseList key={course.id} name={course.name} id={course.id} numChapters={course.numChapters}></CourseList>
                )}
              </div>
              <div id="published">
                <h4>Published</h4>
                {coursesPublished.map(course =>
                  <CourseList key={course.id} name={course.name} id={course.id} numChapters={course.numChapters}></CourseList>
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
  currentUser: PropTypes.string.isRequired,
  searchModal: PropTypes.func.isRequired,
  closeSearchModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    activeTab: state.professorReducer.activeTab,
    showSearchModal: state.professorReducer.showSearchModal,
    searchContent: state.professorReducer.searchContent,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchTabs: (tab) => dispatch(actions.switchTabs(tab)),
    searchModal: () => dispatch(actions.searchModal()),
    closeSearchModal: () => dispatch(actions.closeSearchModal()),
    search: (searchValue) => dispatch(actions.search(searchValue)),

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfessorHome);
