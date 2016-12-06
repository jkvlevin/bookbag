import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';


const FolderList = ({ folderName }) => {
  return (
    <div>
      <ListGroupItem><h4>{folderName}</h4></ListGroupItem>
    </div>
  );
};

FolderList.propTypes = {
  folderName: PropTypes.string.isRequired,
};

export default FolderList;
