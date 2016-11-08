import React, { PropTypes } from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';

const SearchBar = () => {
  return (
      <FormGroup>
        <FormControl  type="text" placeholder="Search" style={{width:"25vw"}}/>
      </FormGroup>
  );
};

// SearchBar.propTypes = {
//   handleSearch: PropTypes.func.isRequired
// };

export default SearchBar;
