import React from "react";

const SearchFilter = ({ search, searchItem }) => {
  return (
    <div>
      filter shown with:
      <input
        type="text"
        role="searchbox"
        value={search}
        onChange={searchItem}
      />
    </div>
  );
};

export default SearchFilter;
