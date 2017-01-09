import React, { PropTypes } from 'react';
import { ListGroupItem, MenuItem, Popover, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import styles from './styles.css'
import MenuIcon from 'react-icons/lib/md/keyboard-control'

const ChapterList = ({ name, owner, pdfUrl, id, folders, addToFolder }) => {

  function handleAddToFolderClick(event) {
    addToFolder(event.target.id, id);
  }

  const chapPop = (
    <Popover id="chap-pop" title="Add to Folder">
      { folders.length > 0 ?
        <ListGroup>
        { folders.map(folder =>
          <ListGroupItem key={folder.id} id={folder.id} onClick={handleAddToFolderClick} style={{borderTop:"none", marginTop:"1px", fontSize:"13px"}}>{folder.foldername}</ListGroupItem>
        )}
        </ListGroup>
      : ''}
    </Popover>
  );
  return (
    <div>
      <ListGroupItem href={pdfUrl} target="_blank" style={{width:"80%", float:"left", borderTop:"none", marginTop:"1px"}}>
        <h4 style={{color:"#407dc6"}}>{name}</h4> - <h5>{owner}</h5>
      </ListGroupItem>
      <OverlayTrigger trigger="click" rootClose placement="right" overlay={chapPop}>
        <Button style={{float:"left", marginTop:"2px", background:"none", border:"none", color:"#1db954", fontWeight:"bold", fontSize:"16px"}}>...</Button>
      </OverlayTrigger>
    </div>
  );
};

ChapterList.propTypes = {
  name: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  pdfUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  folders: PropTypes.array.isRequired,
  addToFolder: PropTypes.func.isRequired
};

export default ChapterList;
