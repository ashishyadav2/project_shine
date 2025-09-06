import ReactDOM from "react-dom";
import Icon from "@mdi/react";
import {
  mdiDotsVertical,
  mdiFolderAlert,
  mdiFolderAlertOutline,
} from "@mdi/js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import {
  faArrowRight,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import { useProjectPageData } from "../EventsHandler/HandleProjectsPage";
import InputField from "../components/InputField";
import ActionButton from "../components/ActionButton";
import axios from "axios";
import { SearchBarExtension } from "../components/SearchBarExtension";
import { useSearchBarExt } from "../EventsHandler/HandleSearchBarExt";
import { utils } from "../jsUtils/utils";
import { HandlePopUp } from "../EventsHandler/HandlePopUp";
import Popup from "../Utilities/Popup";

const Projects = () => {
  const { getISODate, strToDate, prettifyDate } = utils();
  const [isVisible, setIsVisible] = useState(false);
  function showHideSearchBar() {
    setIsVisible(!isVisible);
  }
  const { projectData, loading, error, getProjectData } = useProjectPageData();
  const [expanded, setExpanded] = useState(false);
  const [showSearchExt, setShowSearchExt] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { tags, searchReq, inputChangeHandlers } = useSearchBarExt();
  const {
    popType,
    setPopupType,
    popupMsg,
    setPopupMsg,
    pShowHide,
    setPShowHide,
    Notify,
  } = HandlePopUp();
  const expandSearchBox = () => {
    setExpanded(true);
  };
  useEffect(() => {
    getProjectData(); // fetch data on mount
  }, []);
  // const fetchResults = async (searchText: string) => {
  //   if (!searchText) {
  //     return setResults([]);
  //   }
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8000/api/search/?q=${searchText}/`
  //     );
  //     setResults(res.data);
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchResultsExt = async (searchReqObj: Object) => {
    if (!searchReqObj) {
      return setResults([]);
    }
    try {
      if (!inputChangeHandlers.dataValidation()) {
        Notify("Invalid date range", "pWarn");
        return;
      }
      const res = await axios.post(
        `http://localhost:8000/api/search/`,
        searchReqObj
      );
      if (res.status == 200) {
        setResults(res.data);
      } else {
        Notify("No results found", "pWarn");
        setResults([]);
      }
      console.log(res.data);
    } catch (err) {
      Notify("No results found", "pWarn");
      console.error(err);
    }
  };
  return (
    <>
      <Header isActive="projects" />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <Popup msg={popupMsg} popupType={popType} visible={pShowHide} />
      <div className="cardContainerProject">
        <div className="cardPageContainerTop">
          <p>Projects</p>
          {/* <Icon path={mdiFolderAlert} size={7} /> */}
        </div>
        <div className="searchProjectSuite">
          <div className="searchRegionAdmin">
            {!expanded && (
              <div className="searchBarBox" onClick={expandSearchBox}>
                <span>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    flip={"horizontal"}
                  />
                </span>
                <span>Search</span>
              </div>
            )}
            <div
              className={`searchBar ${
                expanded ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              <FontAwesomeIcon
                onClick={() => {
                  if (expanded) {
                    setExpanded(false);
                  }
                }}
                icon={faMagnifyingGlass}
                flip={"horizontal"}
              />
              <InputField
                type={"text"}
                placeholder={"Search"}
                value={query}
                inputFunc={(e) => {
                  if (e.target.value.length == 0) {
                    setResults([]);
                    setExpanded(false);
                  }
                  inputChangeHandlers.handleSearchText(e.target.value);
                  setQuery(e.target.value);
                }}
              />
              {query.length >= 1 && (
                <ActionButton
                  id={"searchBarCloseBtn"}
                  btnText={<FontAwesomeIcon icon={faXmark} />}
                  btnType={"active"}
                  btnFun={() => {
                    setQuery("");
                    // setExpanded(false);
                  }}
                />
              )}
              <ActionButton
                btnText={<FontAwesomeIcon icon={faArrowRight} />}
                btnType={"active"}
                btnFun={() => {
                  // fetchResults(query);
                  fetchResultsExt(searchReq);
                }}
              />

              <ActionButton
                btnText={<Icon path={mdiDotsVertical} size={1} />}
                btnType={"inactive"}
                btnFun={(e) => {
                  setShowSearchExt(!showSearchExt);
                }}
              />
            </div>
          </div>
          {showSearchExt && (
            <SearchBarExtension
              tags={tags}
              searchReq={searchReq}
              inputChangeHandlers={inputChangeHandlers}
              showHideFlag={showSearchExt}
            />
          )}
        </div>
        <div className="cardPageContainerBtm">
          {(query && results.length > 0 ? results : projectData).map(
            (item, index) => (
              <Card
                key={index}
                cardTags={item.card_tags}
                cardTitle={item.card_title}
                cardDescription={item.card_desc}
                cardBgImgUrl={item.card_img_url ? item.card_img_url : ""}
                fromDate={prettifyDate(item.card_from_date)}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
