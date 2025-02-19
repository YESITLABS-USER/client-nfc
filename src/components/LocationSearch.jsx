import React from "react";

const LocationSearch = () => {
  return (
    <div>
      <div className="influ-drop-list" style={{ display: "block" }}>
        <div className="influ-drop-list-search">
          <input
            type="text"
            placeholder="Type to Search..."
            onChange={handleLocationSearchValue}
          />
          <button type="submit">
            <img src="/images/menu-icons/search-icon.png" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;
