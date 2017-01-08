import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Modal, Form, FormGroup, FormControl, InputGroup, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import SearchIcon from 'react-icons/lib/fa/search';
import FileList from '../../components/ProfessorWorkbench/FileList.js';
import UserIcon from 'react-icons/lib/fa/user';
import CheckoutIcon from 'react-icons/lib/md/assignment-turned-in';
import PublishIcon from 'react-icons/lib/md/publish';
import DotIcon from 'react-icons/lib/go/primitive-dot';
import UploadIcon from 'react-icons/lib/go/cloud-upload';
import DropzoneComponent from 'react-dropzone-component';
import * as actions from './actions.js';
import styles from './styles.css';
import dzstyles from 'react-dropzone-component/styles/filepicker.css';
import dzstyles2 from 'dropzone/dist/min/dropzone.min.css';

class ProfChapter extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: '', showUploadModal: false, uploadFiles: [], uploadCommitMessage: '' };

   this.handleVersionChange = this.handleVersionChange.bind(this);

   this.showUploadModal = this.showUploadModal.bind(this);
   this.closeUploadModal = this.closeUploadModal.bind(this);
   this.handleUploadFileAdded = this.handleUploadFileAdded.bind(this);
   this.handleRemovedFile = this.handleRemovedFile.bind(this);
   this.handleUploadMessageChange = this.handleUploadMessageChange.bind(this);
   this.handleUploadFilesSubmit = this.handleUploadFilesSubmit.bind(this);

   this.handleCheckout = this.handleCheckout.bind(this);

   this.handleCoursesClick = this.handleCoursesClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.handleSettingsClick = this.handleSettingsClick.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);
  }

  componentDidMount() {
    this.props.getChapterById(this.props.params.chapterId);
    this.props.loadChapterVersions(this.props.params.chapterId);
    this.props.loadVersionFiles(this.props.params.chapterId, this.props.versionDisplayed.sha);
  }

  handleVersionChange(event) {
    for (const version in this.props.chapterVersions) {
      if (this.props.chapterVersions[version].sha === event.target.id) {
        this.props.changeCurrentVersion(this.props.chapterVersions[version]);
      }
    }
    this.props.changeCurrentVersionFiles(this.props.params.chapterId, event.target.id);
  }

  showUploadModal() {
    this.setState({ showUploadModal: true });
  }
  closeUploadModal() {
    this.setState({ showUploadModal: false });
  }

  handleUploadFileAdded(file) {
    this.state.uploadFiles.push(file);
    console.log(this.state.uploadFiles);
  }

  handleRemovedFile(file) {
    const i = this.state.uploadFiles.indexOf(file);
    this.state.uploadFiles.splice(i, 1);
    console.log(this.state.uploadFiles);
  }

  handleUploadMessageChange(event) {
    this.setState({ uploadCommitMessage: event.target.value });
  }

  handleUploadFilesSubmit(event) {
    event.preventDefault();
    this.props.submitFiles(this.state.uploadFiles, this.state.uploadCommitMessage, this.props.params.chapterId);
    this.setState({ showUploadModal: false });
  }

  handleCheckout(event) {
    event.preventDefault();
    this.props.checkoutChapter(this.props.params.chapterId);
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

  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  submitSearch(event) {
    event.preventDefault();
    this.props.search(this.state.searchValue);
  }


 render() {
   const isOwner = true;

   const componentConfig = {
     postUrl: 'no-url'
   };
   const djsConfig = {
     addRemoveLinks: true,
     autoProcessQueue: false,
     uploadMultiple: true
   };
   const eventHandlers = {
      addedfile: this.handleUploadFileAdded,
      removedfile: this.handleRemovedFile
    };

   const contributorsPopover = (
      <Popover id="contributors-popover" title="Contributors">
        <ListGroup>

        </ListGroup>
      </Popover>
    );
    return (
      <div id="chapter-container">
        <Sidebar
          isProf={true}
          handleCoursesClick={this.handleCoursesClick}
          handleBrowseClick={this.handleBrowseClick}
          handleSearchClick={this.handleSearchClick}
          handleSettingsClick={this.handleSettingsClick}
          userName={localStorage.getItem('userName')}
        />
        <h1 style={{marginLeft:"220px", marginTop:"25px", fontSize:"22px", color:"#878787"}}> {this.props.params.name} </h1>

        <div id="chapter-home-container">

          <div id="button-options">
            <OverlayTrigger trigger="click" rootClose placement="right" overlay={contributorsPopover}>
              <Button id="contributors-button"><UserIcon/><h4 id="contributors-text">Contributors</h4></Button>
            </OverlayTrigger>
              { isOwner ? <div style={{float:"right", marginRight:"60px", marginTop:"10px", fontSize:"25px"}}><PublishIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Publish</h4></div> : ""}
              { this.props.currentChapter.checkout_user === null ?
                <Button id="checkout-btn" onClick={this.handleCheckout}><CheckoutIcon/><h4 id="checkout-text">Checkout</h4></Button> :
                // <Button disabled id="checked-out-btn"><CheckoutIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Checked Out</h4></Button>
                <Button id="upload-btn" onClick={this.showUploadModal}><UploadIcon/><h4 id="upload-text">Upload Files</h4></Button>
              }
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
            <h5 style={{float:"right", marginTop:"25px", marginRight:"15px"}}> {this.props.versionDisplayed.date} </h5>
          </div>

          <div id="chapter-files">
            <ListGroup>
              {this.props.currentVersionFiles.map(file =>
                <FileList key={file.filename} name={file.filename} downloadUrl={file.downloadURL} isPdf={file.isPDF}/>
              )}
            </ListGroup>
          </div>

          <Modal show={this.state.showUploadModal} onHide={this.closeUploadModal} style={{marginTop:"80px"}}>
           <Modal.Header closeButton>
             <Modal.Title>Upload Files</Modal.Title>
           </Modal.Header>
           <Modal.Body>
            <Form onSubmit={this.handleUploadFilesSubmit}>
              <DropzoneComponent config={componentConfig} djsConfig={djsConfig} eventHandlers={eventHandlers} />
              <FormControl type="text" value={this.state.uploadCommitMessage} placeholder="Short desecription of changes in upload" onChange={this.handleUploadMessageChange} />
              <Button type="submit"> Upload </Button>
            </Form>
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

ProfChapter.propTypes = {
  searchModal: PropTypes.func.isRequired,
  closeSearchModal: PropTypes.func.isRequired,
  showSearchModal: PropTypes.bool.isRequired,
  searchContent: PropTypes.array.isRequired,
  loadChapterVersions: PropTypes.func.isRequired,
  chapterVersions: PropTypes.array.isRequired,
  versionDisplayed: PropTypes.object.isRequired,
  loadVersionFiles: PropTypes.func.isRequired,
  currentVersionFiles: PropTypes.array.isRequired,
  getChapterById: PropTypes.func.isRequired,
  currentChapter: PropTypes.object.isRequired,
  submitFiles: PropTypes.func.isRequired,
  checkoutChapter: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    showSearchModal: state.chapterReducer.showSearchModal,
    searchContent: state.chapterReducer.searchContent,
    chapterVersions: state.chapterReducer.chapterVersions,
    versionDisplayed: state.chapterReducer.versionDisplayed,
    currentVersionFiles: state.chapterReducer.currentVersionFiles,
    currentChapter: state.chapterReducer.currentChapter,
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
    changeCurrentVersion: (version) => dispatch(actions.changeCurrentVersion(version)),
    getChapterById: (id) => dispatch(actions.getChapterById(id)),
    submitFiles: (files, message, chapter) => dispatch(actions.submitFiles(files, message, chapter)),
    checkoutChapter: (id) => dispatch(actions.checkoutChapter(id))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfChapter);
