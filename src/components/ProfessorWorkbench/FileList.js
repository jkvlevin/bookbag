import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import DownloadIcon from 'react-icons/lib/md/file-download';
import FileIcon from 'react-icons/lib/go/file-text';
import PdfIcon from 'react-icons/lib/go/file-pdf';

const FileList = ({ name, isPdf, downloadUrl }) => {
  return (
    <div>
      <ListGroupItem style={{textAlign:"left"}}>
        <div>
          { isPdf ? <PdfIcon style={{fontSize:"18px"}}/> : <FileIcon style={{fontSize:"18px"}}/> }
          <a href={downloadUrl} target="_blank" style={{marginLeft:"15px", marginTop:"5px", color:"#407dc6"}}>{name}</a>
          <a href={downloadUrl} target="_blank"><DownloadIcon style={{float:"right", marginRight:"10px", fontSize:"18px", color:"#1db954"}}/></a>
        </div>
      </ListGroupItem>
    </div>
  );
};

FileList.propTypes = {
  name: PropTypes.string.isRequired,
  isPdf: PropTypes.bool.isRequired,
  downloadUrl: PropTypes.string.isRequired
};

export default FileList;
