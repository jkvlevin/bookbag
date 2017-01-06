import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import UserIcon from 'react-icons/lib/fa/user';

const ChapterList = ({ name, id, numContributors }) => {
  return (
    <div>
      <ListGroupItem style={{textAlign:"left"}}><h4 style={{marginLeft:"15px"}}>{name}</h4> <div style={{float:"right"}}><UserIcon style={{marginRight:"5px", marginTop:"-3px", fontSize:"18px"}}/>{numContributors}</div></ListGroupItem>
    </div>
  );
};

ChapterList.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  numContributors: PropTypes.number
};

export default ChapterList;
