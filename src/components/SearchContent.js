import React, { PropTypes } from 'react';
import { ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap';
import MenuIcon from 'react-icons/lib/md/keyboard-control'


const SearchContent = ({ chapterName }) => {
  return (
    <div>
      <ListGroupItem><h4>{chapterName}</h4>
        <DropdownButton title={<MenuIcon style={{marginBottom:"8px"}}/>} noCaret id="chapter-menu">
          <MenuItem eventKey="1">Add to Course Notes</MenuItem>
          <MenuItem eventKey="2">Add to Folder</MenuItem>
        </DropdownButton>
      </ListGroupItem>
    </div>
  );
};

SearchContent.propTypes = {
  chapterName: PropTypes.string.isRequired,
};

export default SearchContent;
