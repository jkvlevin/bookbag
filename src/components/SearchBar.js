import React from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';

const SearchBar = ({ handleSearch }) => {
  return (
      <FormGroup>
        <FormControl onSubmit={handleSearch} type="text" placeholder="Search" style={{width:"25vw"}}/>
      </FormGroup>
  );
};

export default SearchBar;
