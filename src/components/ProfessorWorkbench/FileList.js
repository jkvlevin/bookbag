import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import DownloadIcon from 'react-icons/lib/md/file-download';
import FileIcon from 'react-icons/lib/go/file-text';
import PdfIcon from 'react-icons/lib/go/file-pdf';

const FileList = ({ name, id, isPdf }) => {
  return (
    <div>
      <ListGroupItem style={{textAlign:"left"}}>
        <div>
          { isPdf ? <PdfIcon style={{fontSize:"16px"}}/> : <FileIcon style={{fontSize:"16px"}}/> }
          <h4 style={{marginLeft:"15px", color:"#407dc6"}}>{name}</h4>
          <DownloadIcon style={{float:"right", marginRight:"10px", fontSize:"16px"}}/>
        </div>
      </ListGroupItem>
    </div>
  );
};

FileList.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isPdf: PropTypes.bool.isRequired
};

export default FileList;
