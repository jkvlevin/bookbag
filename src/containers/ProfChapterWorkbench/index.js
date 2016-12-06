import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Nav, NavItem, Button, ButtonGroup } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfChapterWorkbench extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: ''};

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
   this.handleDownload = this.handleDownload.bind(this);
   this.handleCheckout = this.handleCheckout.bind(this);

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
    this.props.switchChapterTabs(event);
  }

  handleDownload(event) {
    console.log("download");
  }

  handleCheckout(event) {
    console.log("checkout");

  }
 render() {
    return (
      <div id="chapter-container">
        <Sidebar
          isProf={true}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={this.props.currentUser}
        />
        <h1 style={{marginLeft:"220px", fontSize:"22px", color:"#878787"}}> Chapter Name </h1>
        <h1 style={{marginLeft:"220px", fontSize:"12px", color:"#878787"}}> Description </h1>
        <ButtonGroup style={{marginLeft:"220px"}}>
          <Button type="button" className="download-button" onClick={this.handleDownload}>
            Download
          </Button>
          <Button type="button" className="checkout-button" onClick={this.handleCheckout}>
            Checkout
          </Button>
        </ButtonGroup>
        
      </div>
    );
  }
}

ProfChapterWorkbench.propTypes = {
  currentUser: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    activeTab: state.profChapterWorkbenchReducer.activeTab
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchChapterTabs: (tab) => dispatch(actions.switchChapterTabs(tab))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfChapterWorkbench);
