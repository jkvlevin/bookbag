import React, { PropTypes } from 'react';
import { ListGroupItem, DropdownButton, MenuItem, Popover, OverlayTrigger } from 'react-bootstrap';
import MenuIcon from 'react-icons/lib/md/keyboard-control'


const SearchContent = ({ chapterName, courseNames, folderNames }) => {
  const addToCourse = (
   <Popover id="popover-positioned-right" title="Courses" style={{width:"300px"}}>
    <h5>poop</h5>
   </Popover>
  );
  const addToFolder = (
   <Popover id="popover-positioned-right" title="Folders" style={{width:"300px"}}>
    <h5>poop</h5>
   </Popover>
  );
  return (
    <div>
      <ListGroupItem><h4>{chapterName}</h4>
        <DropdownButton title={<MenuIcon style={{marginBottom:"8px"}}/>} noCaret id="chapter-menu">
          <OverlayTrigger trigger="click" rootClose placement="right" overlay={addToCourse}>
            <MenuItem eventKey="1">Add to Course Notes</MenuItem>
          </OverlayTrigger>
          <OverlayTrigger trigger="click" rootClose placement="right" overlay={addToFolder}>
            <MenuItem eventKey="2">Add to Folder</MenuItem>
          </OverlayTrigger>
        </DropdownButton>
      </ListGroupItem>
    </div>
  );
};

SearchContent.propTypes = {
  chapterName: PropTypes.string.isRequired,
  courseNames: PropTypes.array,
  folderNames: PropTypes.array
};

export default SearchContent;
