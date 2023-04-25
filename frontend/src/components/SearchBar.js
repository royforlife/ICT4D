// src/components/SearchBar.js
import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import './components.css';

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <TextField
        label="Search"
        value={keyword}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary" style={{height: 56 /*set location*/ }}>
        <Search />
      </Button>
    </form>
  );
}

export default SearchBar;
