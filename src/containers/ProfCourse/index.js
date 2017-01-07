import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Modal, Form, FormGroup, FormControl, InputGroup, Button } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import CourseChapterList from '../../components/ProfessorWorkbench/CourseChapterList.js';
import SearchIcon from 'react-icons/lib/fa/search';
import ChapterIcon from 'react-icons/lib/go/book';
import SettingsIcon from 'react-icons/lib/go/gear';
import AddIcon from 'react-icons/lib/go/plus';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfCourse extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: ''};

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);
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

 render() {
   const coursechapterlist = [
     {
       name: "Taint Analysis",
       id: "1"
     },
     {
       name: "Cooters",
       id: "2"
     },
     {
       name: "Joe Drinks Goochjuice To Get Big",
       id: "3"
     }
   ];
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
        <h1 style={{marginLeft:"220px", marginTop:"25px", fontSize:"22px", color:"#878787"}}> {this.props.params.name} </h1>
        <p style={{marginLeft:"225px"}}> "Description of the course goes here. Probably has something to do with taints and punching cooters." </p>

        <div id="chapter-home-container">

          <div id="button-options">
            <div style={{display:"inline", marginTop:"10px", fontSize:"25px"}}><ChapterIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>69</h4></div>
            <div style={{display:"inline", marginLeft:"120px", marginTop:"10px", fontSize:"25px"}}><SettingsIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Settings</h4></div>
            <div style={{display:"inline", marginLeft:"120px", marginTop:"10px", fontSize:"25px"}}><AddIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Add Chapter</h4></div>
          </div>

          <div id="course-chapter-list">
            <ListGroup>
              {coursechapterlist.map(chapter =>
                <CourseChapterList key={chapter.id} name={chapter.name} id={chapter.id}/>
              )}
            </ListGroup>
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
      </div>
    );
  }
}

ProfCourse.propTypes = {
  searchModal: PropTypes.func.isRequired,
  closeSearchModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    showSearchModal: state.chapterReducer.showSearchModal,
    searchContent: state.chapterReducer.searchContent,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchModal: () => dispatch(actions.searchModal()),
    closeSearchModal: () => dispatch(actions.closeSearchModal()),
    search: (searchValue) => dispatch(actions.search(searchValue)),

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfCourse);
