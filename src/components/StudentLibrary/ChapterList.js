import React, { PropTypes } from 'react';
import { ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap';
import styles from './styles.css'
import MenuIcon from 'react-icons/lib/md/keyboard-control'


const ChapterList = ({ name, owner, pdfUrl, id }) => {
  return (
    <div>
      <ListGroupItem><a href={pdfUrl} target="_blank"><h4>{name}</h4></a> - <h5>{owner}</h5><DropdownButton title={<MenuIcon style={{marginBottom:"8px"}}/>} noCaret id="chapter-menu">
          <MenuItem eventKey="1">Add Notes</MenuItem>
          <MenuItem eventKey="2">Add to Folder</MenuItem>
        </DropdownButton></ListGroupItem>
    </div>
  );
};

ChapterList.propTypes = {
  name: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  pdfUrl: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default ChapterList;
