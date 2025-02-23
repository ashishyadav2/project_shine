import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "./Navbar";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const TopBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  function showHideSearchBar() {
    setIsVisible(!isVisible);
  }
  return (
    <div className="header">
      <div className="websiteName">Ashish Yadav</div>
      <Navbar />
      <div className="searchBtn">
        {isVisible && (
          <input type="search" placeholder="Search" className="searchBar" />
        )}
        <FontAwesomeIcon icon={faMagnifyingGlass} onClick={showHideSearchBar} />
      </div>
    </div>
  );
};

export default TopBar;
