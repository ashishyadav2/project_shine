import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "./Navbar";
import {
  faBars,
  faClock,
  faClose,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
interface TopBarProps {
  isActive?: string;
}
const TopBar = ({ isActive = "" }: TopBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktopMode, setIsDesktopMode] = useState(true);
  const [isHamMenuActive, setIsHamMenuActive] = useState(false);
  const [phoneModeHideShow, setPhoneModeHideShow] = useState(false);
  const screenWidth = screen.width;
  useEffect(() => {
    if (screenWidth < 768) {
      setIsDesktopMode(false);
      console.log("world");
    } else {
      setIsDesktopMode(true);
      console.log("hello");
    }
  }, []);
  function showHideSearchBar() {
    setIsVisible(!isVisible);
  }
  return (
    <div className="header">
      <div className="font-ui websiteName">Ashish Yadav</div>
      <Navbar
        isActive={isActive}
        isDesktopMode={isDesktopMode}
        phoneModeHideShow={phoneModeHideShow}
      />
      {/* <div className="searchBtn">
        {isVisible && (
          <input type="search" placeholder="Search" className="searchBar" />
        )}
        <FontAwesomeIcon icon={faMagnifyingGlass} onClick={showHideSearchBar} />
      </div> */}
      {!isDesktopMode &&
        (isHamMenuActive ? (
          <div
            className="closeHamBurgerMenu"
            onClick={() => {
              setIsHamMenuActive(false);
              setPhoneModeHideShow(false);
            }}
          >
            {<FontAwesomeIcon icon={faClose} />}
          </div>
        ) : (
          <div
            className="hamBurgerMenu"
            onClick={() => {
              setIsHamMenuActive(true);
              setPhoneModeHideShow(true);
            }}
          >
            {<FontAwesomeIcon icon={faBars} rotate={35} />}
          </div>
        ))}
    </div>
  );
};

export default TopBar;
