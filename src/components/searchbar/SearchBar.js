import React, { useState } from "react";
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { v4 as uuidv4 } from "uuid";

function SearchBar({ placeholder, data, onSearchBarClick }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    console.log(data)
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return (
        value.description?.toLowerCase().includes(searchWord.toLowerCase()) ||
        value.id?.toString().toLowerCase().includes(searchWord.toLowerCase()) ||
        value.name?.toLowerCase().includes(searchWord.toLowerCase()) ||
        value.place?.toLowerCase().includes(searchWord.toLowerCase()) ||
        value.address?.toLowerCase().includes(searchWord.toLowerCase()) ||
        value.type?.toLowerCase().includes(searchWord.toLowerCase()) ||
        value.created_user
          ?.toString()
          .toLowerCase()
          .includes(searchWord.toLowerCase()) ||
        value.event_id
          ?.toString()
          .toLowerCase()
          .includes(searchWord.toLowerCase()) ||
        value.eventname?.toLowerCase().includes(searchWord.toLowerCase()) ||
        value.student
          ?.toString()
          .toLowerCase()
          .includes(searchWord.toLowerCase())
      );
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <div className="left-input">
        {wordEntered.length === 0 && (
            <SearchIcon />
          )}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="right-input">
          {filteredData.length !== 0 && (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a
                className="dataItem"
                onClick={(e) => {
                  e.preventDefault();
                  onSearchBarClick(value);
                }}
                target="_blank"
                key={uuidv4()}
              >
                <p>{value.name ? value.name : value.eventname} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
