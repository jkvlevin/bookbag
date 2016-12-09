import React, { PropTypes } from 'react';
import { ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap';
import styles from './styles.css'
import MenuIcon from 'react-icons/lib/md/keyboard-control'


const ChapterList = ({ name, owner, pdfUrl, id }) => {
  return (
    <div>
      <ListGroupItem><h4>{name}</h4> - <h5>{owner}</h5><DropdownButton title={<MenuIcon style={{marginBottom:"8px"}}/>} noCaret id="chapter-menu">
          <MenuItem eventKey="1">Add Chapter Notes</MenuItem>
          <MenuItem eventKey="2">Add to Folder</MenuItem>
        </DropdownButton></ListGroupItem>
    </div>
  );
};

ChapterList.propTypes = {
  name: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  pdfUrl: PropTypes.string,
  id: PropTypes.string,
};

export default ChapterList;
