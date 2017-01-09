import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Modal, Form, FormGroup, FormControl, ControlLabel, InputGroup, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import SearchContent from '../../components/SearchContent';
import SearchIcon from 'react-icons/lib/fa/search';
import FileList from '../../components/ProfessorWorkbench/FileList.js';
import UserIcon from 'react-icons/lib/fa/user';
import CheckoutIcon from 'react-icons/lib/md/assignment-turned-in';
import PublishIcon from 'react-icons/lib/md/publish';
import DotIcon from 'react-icons/lib/go/primitive-dot';
import UploadIcon from 'react-icons/lib/go/cloud-upload';
import AddIcon from 'react-icons/lib/md/add-circle-outline.js';
import PrivateIcon from 'react-icons/lib/md/vpn-lock';
import PublicIcon from 'react-icons/lib/md/public';
import DropzoneComponent from 'react-dropzone-component';
import * as actions from './actions.js';
import styles from './styles.css';
import dzstyles from 'react-dropzone-component/styles/filepicker.css';
import dzstyles2 from 'dropzone/dist/min/dropzone.min.css';

class ProfChapter extends React.Component {
  constructor(props) {
   super(props);

   this.state = { searchValue: '', showUploadModal: false, uploadFiles: [], uploadCommitMessage: '', showAddContributors: false, searchContributorsValue: ''};

   this.handleVersionChange = this.handleVersionChange.bind(this);

   this.showUploadModal = this.showUploadModal.bind(this);
   this.closeUploadModal = this.closeUploadModal.bind(this);
   this.handleUploadFileAdded = this.handleUploadFileAdded.bind(this);
   this.handleRemovedFile = this.handleRemovedFile.bind(this);
   this.handleUploadMessageChange = this.handleUploadMessageChange.bind(this);
   this.handleUploadFilesSubmit = this.handleUploadFilesSubmit.bind(this);

   this.handleCheckout = this.handleCheckout.bind(this);

   this.showAddContributors = this.showAddContributors.bind(this);
   this.handleSearchContributorsChange = this.handleSearchContributorsChange.bind(this);
   this.submitContributorsSearch = this.submitContributorsSearch.bind(this);
   this.handleAddContributors = this.handleAddContributors.bind(this);

   this.handlePublish = this.handlePublish.bind(this);

   this.handleWorkbenchClick = this.handleWorkbenchClick.bind(this);
   this.handleSearchClick = this.handleSearchClick.bind(this);
   this.logout = this.logout.bind(this);
   this.handleSearchChange = this.handleSearchChange.bind(this);
   this.submitSearch = this.submitSearch.bind(this);

   this.componentConfig = {
      showFiletypeIcon: true,
      postUrl: '/api/prof/upload',
   };

   this.djsConfig = {
      addRemoveLinks: true,
   };

    this.dropzone = null;
  }

  componentDidMount() {
    this.props.getChapterById(this.props.params.chapterId);
    this.props.loadChapterVersions(this.props.params.chapterId);
    this.props.loadVersionFiles(this.props.params.chapterId, this.props.versionDisplayed.sha);
    this.props.checkIfCheckoutUser(this.props.params.chapterId);
    this.props.checkIsOwner(this.props.params.chapterId);
    this.props.getContributors(this.props.params.chapterId);
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
    this.setState({ showUploadModal: false, uploadFiles: [], uploadCommitMessage:'' });
  }

  handleUploadFileAdded(file) {
    this.state.uploadFiles.push(file);
  }

  handleRemovedFile(file) {
    const i = this.state.uploadFiles.indexOf(file);
    this.state.uploadFiles.splice(i, 1);
  }

  handleUploadMessageChange(event) {
    this.setState({ uploadCommitMessage: event.target.value });
  }

  handleUploadFilesSubmit(event) {
    event.preventDefault();
    this.props.submitFiles(this.state.uploadFiles, this.state.uploadCommitMessage, this.props.params.chapterId);
    this.setState({ showUploadModal: false, uploadFiles: [], uploadCommitMessage: '' });
  }

  handleCheckout(event) {
    event.preventDefault();
    this.props.checkoutChapter(this.props.params.chapterId);
  }

  showAddContributors() {
    this.setState({ showAddContributors: true });
  }

  handleSearchContributorsChange(event) {
    this.setState({ searchContributorsValue: event.target.value });
  }

  submitContributorsSearch(event) {
    event.preventDefault();
    this.props.searchProfs(this.state.searchContributorsValue);
    this.setState({ searchContributorsValue: '' });
  }

  handleAddContributors(event) {
    this.props.addContributor(event.target.id, this.props.params.chapterId);
    this.props.loadSearchProfsResults([]);
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

  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  submitSearch(event) {
    event.preventDefault();
    this.props.search(this.state.searchValue);
  }

  handlePublish(event) {
    this.props.publish(this.props.params.chapterId, event.target.id);
  }


 render() {
   const config = this.componentConfig;
   const djsConfig = this.djsConfig;
   const eventHandlers = {
      init: dz => this.dropzone = dz,
      addedfile: this.handleUploadFileAdded,
      removedfile: this.handleRemovedFile
    };

   const contributorsPopover = (
      <Popover ref="cont_pop" id="contributors-popover" title={this.props.currentChapter.name + " Contributors"} style={{width:"300px"}}>
        <ListGroup>
          { this.props.contributors ? this.props.contributors.map(user =>
            <ListGroupItem key={user.id} style={{borderTop:"none", marginTop:"1px"}}>
              <h5 style={{display:"inline"}}>{user.firstname} {user.lastname}</h5>
              { this.props.isOwner ? <Button style={{float:"right", marginTop:"-7px", color:"#878787", background:"none", border:"none", fontSize:"14px"}}>x</Button> : ''}
            </ListGroupItem>
          ) : '' }
        </ListGroup>
        { this.state.showAddContributors ?
          <Form onSubmit={this.submitContributorsSearch} style={{marginTop:"25px"}}>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" value={this.state.searchContributorsValue} placeholder="Search professors by name" onChange={this.handleSearchContributorsChange}/>
              <InputGroup.Button>
                <Button type="submit"> <SearchIcon style={{color:"#1db954"}}/> </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          </Form>
        : ''}
        { this.props.searchProfsResults.length > 0 ?
          <ListGroup>
            { this.props.searchProfsResults.map(prof =>
              <ListGroupItem key={prof.id}>
                <h5 style={{display:"inline"}}>{prof.firstname} {prof.lastname}</h5>
                <Button onClick={this.handleAddContributors} id={prof.id} style={{float:"right", background:"none", border:"none", marginTop:"-7px", color:"#1db954", fontSize:"15px"}}>+</Button>
              </ListGroupItem>
            )}
          </ListGroup>
          : ''}
        { this.props.isOwner ? <div style={{textAlign:"center"}}><Button style={{border:"none", background:"none"}} onClick={this.showAddContributors}><AddIcon style={{fontSize:"26px", color:"#1db954"}}/></Button></div>: ''}
      </Popover>
    );

    const publishPopover = (
      <Popover id="publish-popover" title={"Version " + this.props.versionDisplayed.version} style={{width:"400px !impotant"}}>
        <ListGroup>
          {this.props.currentVersionFiles.map(file =>
            file.isPDF ?
            <ListGroupItem key={file.downloadURL} style={{borderTop:"none", marginTop:"1px"}}>
              {file.filename}
              <Button onClick={this.handlePublish} id={file.downloadURL} style={{float:"right", background:"none", border:"none", marginTop:"-5px", color:"#1db594"}}><PublishIcon id={file.downloadURL} onClick={this.handlePublish}/></Button>
            </ListGroupItem> :
            ''
          )}
        </ListGroup>
      </Popover>
    )
    return (
      <div id="chapter-container">
        <Sidebar
          isProf={true}
          handleWorkbenchClick={this.handleWorkbenchClick}
          handleSearchClick={this.handleSearchClick}
          logout={this.logout}
          userName={localStorage.getItem('userName')}
        />
        <h1 style={{marginLeft:"220px", marginTop:"25px", fontSize:"22px", color:"#878787"}}>
          {this.props.params.name} {this.props.currentChapter.public ? <PublicIcon style={{marginLeft:"75%", fontSize:"30px"}}/> : <PrivateIcon style={{marginLeft:"75%", fontSize:"30px"}}/>}
        </h1>
        <p style={{marginLeft:"235px", fontSize:"11px"}}>"{this.props.currentChapter.description}"</p>

          <div id="button-options">
            <OverlayTrigger trigger="click" rootClose placement="right" overlay={contributorsPopover}>
              <Button id="contributors-button"><UserIcon/><h4 id="contributors-text">Contributors </h4></Button>
            </OverlayTrigger>
              { this.props.isOwner ?
                  this.props.currentChapter.public ?
                    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={publishPopover}>
                      <Button id="publish-button"><PublishIcon style={{color:"#1db954"}}/><h4 id="publish-text">Update Published Version</h4></Button>
                    </OverlayTrigger> :
                    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={publishPopover}>
                      <Button id="publish-button"><PublishIcon style={{color:"#1db954"}}/><h4 id="publish-text">Publish</h4></Button>
                    </OverlayTrigger>
                : ""}
              { this.props.currentChapter.checkout_user === null ?
                <Button id="checkout-btn" onClick={this.handleCheckout}><CheckoutIcon/><h4 id="checkout-text">Checkout</h4></Button> :
                this.props.checkoutUser ?
                <Button id="upload-btn" onClick={this.showUploadModal}><UploadIcon style={{color:"#407dc6"}}/><h4 id="upload-text">Upload Files & Check-In</h4></Button> :
                <Button disabled id="checked-out-btn"><CheckoutIcon/><h4 style={{marginLeft:"10px", color:"#868686"}}>Checked Out</h4></Button>
              }
          </div>

          <div id="version-list">
            <ListGroup>
              {this.props.chapterVersions.map(version =>
                <ListGroupItem key={version.sha} id={version.sha} style={{textAlign:"left", fontSize:"12px"}} onClick={this.handleVersionChange}>
                  Version {version.version} - <div id={version.sha} onClick={this.handleVersionChange} style={{fontSize:"10px", fontStyle:"italic", display:"inline"}}>{version.author}</div>
                  {(this.props.versionDisplayed.sha === version.sha) ? <DotIcon style={{float:"right", marginTop:"3px", fontSize:"14px", color:"#1db594"}}/> : ""}
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
            <Form onSubmit={this.handleUploadFilesSubmit} encType="multipart\/form-data">
              <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
              <FormControl type="text" value={this.state.uploadCommitMessage} placeholder="Short desecription of changes in upload" onChange={this.handleUploadMessageChange} style={{marginTop:"25px"}} />
              <div style={{textAlign:"center"}}><Button type="submit" style={{marginTop:"30px", backgroundColor:"#1db954", color:"white", borderRadius:"20px"}}> Upload </Button></div>
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
  checkoutChapter: PropTypes.func.isRequired,
  checkIfCheckoutUser: PropTypes.func.isRequired,
  checkoutUser: PropTypes.bool.isRequired,
  checkIsOwner: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
  getContributors: PropTypes.func.isRequired,
  contributors: PropTypes.array.isRequired,
  searchProfs: PropTypes.func.isRequired,
  searchProfsResults: PropTypes.array.isRequired,
  addContributor: PropTypes.func.isRequired,
  publish: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    showSearchModal: state.chapterReducer.showSearchModal,
    searchContent: state.chapterReducer.searchContent,
    chapterVersions: state.chapterReducer.chapterVersions,
    versionDisplayed: state.chapterReducer.versionDisplayed,
    currentVersionFiles: state.chapterReducer.currentVersionFiles,
    currentChapter: state.chapterReducer.currentChapter,
    checkoutUser: state.chapterReducer.checkoutUser,
    isOwner: state.chapterReducer.isOwner,
    contributors: state.chapterReducer.contributors,
    searchProfsResults: state.chapterReducer.searchProfsResults
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
    checkoutChapter: (id) => dispatch(actions.checkoutChapter(id)),
    checkIfCheckoutUser: (id) => dispatch(actions.checkIfCheckoutUser(id)),
    checkIsOwner: (id) => dispatch(actions.checkIsOwner(id)),
    getContributors: (id) => dispatch(actions.getContributors(id)),
    searchProfs: (name) => dispatch(actions.searchProfs(name)),
    addContributor: (id, chapter) => dispatch(actions.addContributor(id, chapter)),
    loadSearchProfsResults: (profs) => dispatch(actions.loadSearchProfsResults(profs)),
    publish: (chapter, url) => dispatch(actions.publish(chapter, url))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfChapter);
