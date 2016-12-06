import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Nav, NavItem } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
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

   this.handleSelect = this.handleSelect.bind(this);
 }

  handleCoursesClick() {
    browserHistory.push('/student');
  }

  handleBrowseClick() {
    alert('Browse');
  }

  handleSearchClick() {
    alert('search');
  }

  handleSettingsClick() {
    alert('Settings');
  }
  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value });
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
          userName={this.props.currentUser}
        />
        <h1 style={{marginLeft:"220px", fontSize:"22px", color:"#878787"}}> Welcome back jklevin </h1>
        <div id="workbench-home-container">
          <Nav bsStyle="tabs" justified activeKey={this.props.activeTab} onSelect={this.handleSelect} style={{width:"200px", marginLeft:"34%", marginTop:"35px"}}>
            <NavItem eventKey={1}>Chapters</NavItem>
            <NavItem eventKey={2}>Courses</NavItem>
          </Nav>
          {this.props.activeTab == 1 ?
            <div id="chapters">
              <div id="in-progress">
                <h5>In Progress</h5>
              </div>
              <div id="published">
                <h5>Published</h5>
              </div>
            </div> :
          <div id="courses">
            <div id="in-progress">
              <h5>In Progress</h5>
            </div>
            <div id="published">
              <h5>Published</h5>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

ProfessorHome.propTypes = {
  currentUser: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    activeTab: state.professorReducer.activeTab
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchTabs: (tab) => dispatch(actions.switchTabs(tab))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfessorHome);
