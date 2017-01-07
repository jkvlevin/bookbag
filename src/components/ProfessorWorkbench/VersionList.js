import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import DownloadIcon from 'react-icons/lib/md/file-download';
import DotIcon from 'react-icons/lib/go/primitive-dot';

const VersionList = ({ version, id, author, versionDisplayed }) => {
  return (
    <div>
      <ListGroupItem style={{textAlign:"left"}}>
        <h5>Version {version} - <div style={{fontSize:"10px", fontStyle:"italic", display:"inline"}}>{author}</div>
        {(versionDisplayed === id) ? <DotIcon style={{float:"right", marginTop:"5px", fontSize:"14px", color:"#1db594"}}/> : ""}
        </h5>
      </ListGroupItem>
    </div>
  );
};

VersionList.propTypes = {
  version: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  author: PropTypes.string,
  versionDisplayed: PropTypes.string.isRequired
};

export default VersionList;
