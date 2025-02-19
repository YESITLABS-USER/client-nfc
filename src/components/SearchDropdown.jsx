import React, { useState, useEffect, useRef } from "react";

const SearchDropdown = ({ label, onSearchChange, isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="influ-dropdown" ref={dropdownRef}>
      <button className="influ-btn influ-drop-btn" type="button" onClick={() => setIsOpen(!isOpen)} >
        {label}
        <img src={"/images/menu-icons/drop-down-icon.svg"} alt="" />
      </button>
      {isOpen && (
        <div className="influ-drop-list" style={{ display: "block" }}>
          <div className="influ-drop-list-search">
            <input type="text" placeholder="Type to Search..." onChange={(e) => onSearchChange(e.target.value)} />
            <button>
              <img src={"/images/menu-icons/search-icon.png"} alt="search icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
