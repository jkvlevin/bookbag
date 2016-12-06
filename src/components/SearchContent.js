import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';


const SearchContent = ({ chapterName }) => {
  return (
    <div>
      <ListGroupItem><h4>{chapterName}</h4></ListGroupItem>
    </div>
  );
};

SearchContent.propTypes = {
  chapterName: PropTypes.string.isRequired,
};

export default SearchContent;
