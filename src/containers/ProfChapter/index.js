import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Modal, Form, FormGroup, FormControl, InputGroup, Button } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import SearchIcon from 'react-icons/lib/fa/search';
import FileList from '../../components/ProfessorWorkbench/FileList.js';
import UserIcon from 'react-icons/lib/fa/user';
import CheckoutIcon from 'react-icons/lib/md/assignment-turned-in';
import PublishIcon from 'react-icons/lib/md/publish';
import DotIcon from 'react-icons/lib/go/primitive-dot';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfChapter extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: ''};

   this.handleVersionChange = this.handleVersionChange.bind(this);

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleBrowseClick = this.handleBrowseClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);
  }

  componentDidMount() {
    this.props.loadChapterVersions(this.props.currentChapter.id);
    this.props.loadVersionFiles(this.props.currentChapter.id, this.props.versionDisplayed.sha);
  }

  handleVersionChange(event) {
    for (const version in this.props.chapterVersions) {
      if (this.props.chapterVersions[version].sha === event.target.id) {
        this.props.changeCurrentVersion(this.props.chapterVersions[version]);
      }
    }
    this.props.changeCurrentVersionFiles(this.props.currentChapter.id, event.target.id);
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
   const isOwner = true;
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
        <h1 style={{marginLeft:"220px", marginTop:"25px", fontSize:"22px", color:"#878787"}}> Chapter Name </h1>

        <div id="chapter-home-container">

          <div id="button-options">
              <div style={{float:"left", marginLeft:"60px", marginTop:"10px", fontSize:"25px"}}><UserIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Contributors</h4></div>
              { isOwner ? <div style={{float:"right", marginRight:"60px", marginTop:"10px", fontSize:"25px"}}><PublishIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Publish</h4></div> : ""}
              <div style={{float:"right", marginRight:"60px", marginTop:"10px", fontSize:"25px"}}><CheckoutIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Checkout</h4></div>
          </div>

          <div id="version-list">
            <ListGroup>
              {this.props.chapterVersions.map(version =>
                <ListGroupItem key={version.sha} id={version.sha} style={{textAlign:"left"}} onClick={this.handleVersionChange}>
                  Version {version.version} - <div id={version.sha} onClick={this.handleVersionChange} style={{fontSize:"10px", fontStyle:"italic", display:"inline"}}>{version.author}</div>
                  {(this.props.versionDisplayed.sha === version.sha) ? <DotIcon style={{float:"right", marginTop:"5px", fontSize:"14px", color:"#1db594"}}/> : ""}
                </ListGroupItem>
              )}
            </ListGroup>
          </div>

          <div id="file-title">
            <h4 style={{float:"left", fontSize:"20px", marginTop:"25px", marginLeft:"5px"}}> Version {this.props.versionDisplayed.version} </h4>
            <p style={{float:"left", marginLeft:"45px", marginTop:"25px", fontSize:"12px"}}> {this.props.versionDisplayed.message} </p>
            <h5 style={{float:"right", marginTop:"25px", marginRight:"30px"}}> {this.props.versionDisplayed.date} </h5>
          </div>

          <div id="chapter-files">
            <ListGroup>
              {this.props.currentVersionFiles.map(file =>
                <FileList key={file.filename} name={file.filename} downloadUrl={file.downloadURL} isPdf={file.isPDF}/>
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

ProfChapter.propTypes = {
  currentUser: PropTypes.string.isRequired,
  searchModal: PropTypes.func.isRequired,
  closeSearchModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
  loadChapterVersions: PropTypes.func.isRequired,
  chapterVersions: PropTypes.array.isRequired,
  currentChapter: PropTypes.object.isRequired,
  versionDisplayed: PropTypes.object.isRequired,
  loadVersionFiles: PropTypes.func.isRequired,
  currentVersionFiles: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
    showSearchModal: state.chapterReducer.showSearchModal,
    searchContent: state.chapterReducer.searchContent,
    currentChapter: state.chapterReducer.currentChapter,
    chapterVersions: state.chapterReducer.chapterVersions,
    versionDisplayed: state.chapterReducer.versionDisplayed,
    currentVersionFiles: state.chapterReducer.currentVersionFiles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadChapterVersions: (id) => dispatch(actions.loadChapterVersions(id)),
    loadVersionFiles: (sha) => dispatch(actions.loadVersionFiles(sha)),
    searchModal: () => dispatch(actions.searchModal()),
    closeSearchModal: () => dispatch(actions.closeSearchModal()),
    search: (searchValue) => dispatch(actions.search(searchValue)),
    changeCurrentVersionFiles: (chapterId, sha) => dispatch(actions.changeCurrentVersionFiles(chapterId, sha)),
    changeCurrentVersion: (version) => dispatch(actions.changeCurrentVersion(version))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfChapter);
