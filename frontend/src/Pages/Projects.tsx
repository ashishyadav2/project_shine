import ReactDOM from "react-dom";
import Icon from "@mdi/react";
import {
  mdiDotsVertical,
  mdiFolderAlert,
  mdiFolderAlertOutline,
  mdiSort,
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
import Skeleton from "../components/Skeleton";

const Projects = () => {
  const { getISODate, strToDate, prettifyDate } = utils();
  const [isVisible, setIsVisible] = useState(false);
  function showHideSearchBar() {
    setIsVisible(!isVisible);
  }
  const {
    hasMore,
    setHasMore,
    currOffset,
    setCurrOffset,
    projectData,
    loading,
    setLoading,
    error,
    getProjectData,
    setProjectData,
  } = useProjectPageData();
  const [expanded, setExpanded] = useState(false);

  // const [showSearchExt, setShowSearchExt] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedSortOrder, setSelectedSortOrder] = useState("-1");
  const [pageLoading, setPageLoading] = useState(true);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);
  const [isSearchResultPresnt, setIsSearchResultPresent] = useState(false);
  // const { tags, searchReq, inputChangeHandlers } = useSearchBarExt();
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

  // useEffect(() => {
  //   getProjectData(false, selectedSortOrder); // fetch data on mount
  //   // setPageLoading(false);
  // }, []);
  const fetchResults = async (
    searchText: string,
    sortOrder: string,
    st: Number = 0,
    loadMore: boolean = false
  ) => {
    if (!searchText) {
      return setResults([]);
    }

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/search/?q=${searchText}&sort=${sortOrder}&st=${st}&loadMore=${loadMore}&/`
      );
      if (res.status == 200) {
        let currOffsett = res.data.pop();
        let hasMoreFlag = res.data.pop();
        // if (loadMoreSearch) {
        if (hasMoreFlag === undefined) {
          hasMoreFlag = { hasMore: false };
        }
        if (currOffsett === undefined) {
          currOffsett = { curr_offset: 0 };
        }
        setHasMoreSearch(hasMoreFlag["hasMore"]);
        setCurrOffset(currOffsett["curr_offset"]);
        setResults(res.data);
        setIsSearchResultPresent(res.data.length > 0);
        setProjectData(() => {
          if (loadMore) {
            let prevData = [...projectData];
            if (prevData.length > 0) {
              return [...prevData, ...res.data];
            }
          }
          return [...res.data];
        });
      } else {
        Notify("No results found", "pWarn");
        setResults([]);
        setProjectData([]);
      }
      if (import.meta.env.VITE_LOGGING) {
        console.log(res.data);
      }
    } catch (err) {
      Notify("No results found", "pWarn");
      if (import.meta.env.VITE_LOGGING) {
        console.error(err);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!selectedSortOrder) return;
    if (query.length > 0) {
      fetchResults(query, selectedSortOrder, 0, false);
    } else {
      getProjectData(false, selectedSortOrder);
    }
  }, [selectedSortOrder]);
  const sortFilter = async (sortOrder: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/search/?sort=${sortOrder}`
      );
      if (res.status == 200) {
        setResults(res.data);
        setProjectData(res.data);
        if (import.meta.env.VITE_LOGGING) {
          console.log(projectData);
          console.log(res.data);
        }
      } else {
        Notify("No results found", "pWarn");
        setProjectData([]);
        setResults([]);
      }
      // console.log(res.data);
    } catch (err) {
      Notify("No results found", "pWarn");
      if (import.meta.env.VITE_LOGGING) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <Header isActive="projects" />
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
                    // setShowSearchExt(false);
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
                    // setShowSearchExt(false);
                  }
                  // inputChangeHandlers.handleSearchText(e.target.value);
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
                  fetchResults(query, selectedSortOrder, 0, false);
                  // fetchResultsExt(searchReq);
                }}
              />

              {/* <ActionButton
                btnText={<Icon path={mdiDotsVertical} size={1} />}
                btnType={"inactive"}
                btnFun={(e) => {
                  setShowSearchExt(!showSearchExt);
                }}
              /> */}
            </div>
          </div>
          {/* {showSearchExt && (
            <SearchBarExtension
              tags={tags}
              searchReq={searchReq}
              inputChangeHandlers={inputChangeHandlers}
              showHideFlag={showSearchExt}
            />
          )} */}
        </div>
        <div className="sortFilterUser">
          <div className="sortFilterDropDown">
            <select
              value={selectedSortOrder}
              onChange={(e) => {
                setSelectedSortOrder(e.target.value);
              }}
            >
              <option value={-1}>Latest</option>
              <option value={1}>Older</option>
            </select>
          </div>
        </div>

        <div className="cardPageContainerBtm">
          {error && (
            <span>
              <Icon path={mdiFolderAlert} size={7} />
              <br></br>No project has been created
            </span>
          )}
          {(projectData.length > 0 ? projectData : []).map((item, index) => (
            <Card
              key={index}
              cardTags={item.card_tags}
              cardTitle={item.card_title}
              cardDescription={item.card_desc}
              cardBgImgUrl={item.card_img_url ? item.card_img_url : ""}
              fromDate={prettifyDate(item.card_from_date)}
            />
          ))}
        </div>
        {loading && <Skeleton />}
        {!isSearchResultPresnt ? (
          <div className="loadMoreContainer">
            {hasMore && (
              <ActionButton
                btnText={"Load more"}
                btnFun={(e) => {
                  setLoading(true);
                  let newOffset = Number(currOffset);
                  getProjectData(true, "-1", newOffset.toString());
                }}
              />
            )}
          </div>
        ) : (
          <div className="loadMoreContainer">
            {hasMoreSearch && (
              <ActionButton
                btnText={"Show more results"}
                btnFun={(e) => {
                  setLoading(true);
                  let newOffset = Number(currOffset);
                  fetchResults(query, selectedSortOrder, newOffset, true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
