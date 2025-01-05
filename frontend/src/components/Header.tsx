import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "./Navbar";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const TopBar = () => {
  return (
    <div className="header">
      <div className="websiteName">Ashish Yadav</div>
      <Navbar />
      <div className="searchBtn">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
    </div>
  );
};

export default TopBar;
