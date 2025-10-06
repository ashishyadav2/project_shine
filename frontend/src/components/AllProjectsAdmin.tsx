import { mdiDotsVertical, mdiFolderAlert } from "@mdi/js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import { useProjectPageData } from "../EventsHandler/HandleProjectsPage";
import { HandleAllProjectsAdmin } from "../EventsHandler/HandleAllProjectsAdmin";
import InputField from "./InputField";
import ActionButton from "./ActionButton";
import {
  faArrowRight,
  faMagnifyingGlass,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import bgImage from "../assets/image_placeholder.jpg";
import { HandlePopUp } from "../EventsHandler/HandlePopUp";
import Popup from "../Utilities/Popup";
import { useSearchBarExt } from "../EventsHandler/HandleSearchBarExt";
import { utils } from "../jsUtils/utils";
import { SearchBarExtension } from "./SearchBarExtension";
import Icon from "@mdi/react";
import Skeleton from "./Skeleton";

interface AllProjectsAdminProps {
  formReactState: React.Dispatch<
    React.SetStateAction<{
      title: string;
      desc: string;
      github_url: string;
      tags: string;
      img_url: string;
      old_img_id: string;
      new_img_id: string;
      is_img_removed: boolean;
      from_date: string;
    }>
  >;
  formDataValue: {
    title: string;
    desc: string;
    github_url: string;
    tags: string;
    img_url: string;
    old_img_id: string;
    new_img_id: string;
    is_img_removed: boolean;
    from_date: string;
  };
  imageReactState: React.Dispatch<React.SetStateAction<string>>;
  isEditBtnBool: boolean;
  isEditReactState: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFileValue: null;
  selectedFileReactState: React.Dispatch<React.SetStateAction<null>>;
  setFormIdReactState: React.Dispatch<React.SetStateAction<string>>;
  previewImgValue: string;
  adminFormVisibleReactState: React.Dispatch<React.SetStateAction<string>>;
}

const AllProjectsAdmin = ({
  formReactState,
  formDataValue,
  imageReactState,
  isEditBtnBool,
  isEditReactState,
  selectedFileValue,
  selectedFileReactState,
  setFormIdReactState,
  previewImgValue,
  adminFormVisibleReactState,
}: AllProjectsAdminProps) => {
  const { getISODate, strToDate, prettifyDate } = utils();
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
  const { editController, handleDelete, copyControllerLogic } =
    HandleAllProjectsAdmin();
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    getProjectData(false);
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDeletePopUP, setShowDeletePopUP] = useState(false);
  const { tags, searchReq, inputChangeHandlers } = useSearchBarExt();
  const [showSearchExt, setShowSearchExt] = useState(false);
  const [loadMoreSearch, setLoadMoreSearch] = useState(true);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);
  const [isSearchResultPresnt, setIsSearchResultPresent] = useState(false);
  const [delItem, setDelItem] = useState({
    card_img_id: "",
    card_id: "",
    card_tags: [],
  });
  const {
    popType,
    setPopupType,
    popupMsg,
    setPopupMsg,
    pShowHide,
    setPShowHide,
    Notify,
  } = HandlePopUp();
  const resetFormForAddProject = () => {
    adminFormVisibleReactState("adminFormShow");
    isEditReactState(false);
    formReactState({
      title: "",
      desc: "",
      github_url: "",
      tags: "",
      img_url: "",
      old_img_id: "",
      new_img_id: "",
      is_img_removed: false,
      from_date: "",
    });
    selectedFileReactState(null);
    imageReactState(bgImage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchResults = async (searchText: string) => {
    if (!searchText) {
      return setResults([]);
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/search/?q=${searchText}/`
      );
      setResults(res.data);
      if (import.meta.env.VITE_LOGGING) {
        console.log(res.data);
      }
    } catch (err) {
      if (import.meta.env.VITE_LOGGING) {
        console.error(err);
      }
    }
  };

  const formatImgId = (img_url: string) => {
    const parts = img_url.split("/");
    return parts[parts.length - 2];
  };
  useEffect(() => {
    if (projectData && projectData.length > 0) {
      setPageLoading(false);
    }
  }, [projectData]);
  const [expanded, setExpanded] = useState(false);
  const expandSearchBox = () => {
    setExpanded(true);
  };
  const fetchResultsExt = async (
    searchReqObj: Object,
    loadMoreSearch: boolean = false,
    startIndex: Number = 0
  ) => {
    try {
      if (!loadMoreSearch) {
        if (!searchReqObj) {
          return setResults([]);
        }
        if (!inputChangeHandlers.dataValidation()) {
          Notify("Invalid date range", "pWarn");
          return;
        }
      }
      if (loadMoreSearch) {
        searchReqObj = {
          ...searchReqObj,
          loadMore: loadMoreSearch,
          st: startIndex,
        };
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/search/`,
        searchReqObj,
        { withCredentials: true }
      );
      if (res.status == 200) {
        if (import.meta.env.VITE_LOGGING) {
          console.log(res.data);
        }
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
        // }
        setIsSearchResultPresent(res.data.length > 0);
        if (import.meta.env.VITE_LOGGING) {
          console.log(hasMoreSearch);
        }
        setProjectData(() => {
          if (loadMoreSearch) {
            let prevData = [...projectData];
            if (prevData.length > 0) {
              return [...prevData, ...res.data];
            }
          }
          return [...res.data];
        });
        setLoading(false);
        setResults(res.data);
        // setProjectData(res.data);
      } else {
        Notify("No results found", "pWarn");
        setProjectData([]);
        setResults([]);
        setLoading(false);
        setHasMoreSearch(false);
      }
      if (import.meta.env.VITE_LOGGING) {
        console.log(res.data);
      }
    } catch (err) {
      setHasMoreSearch(false);
      setLoading(false);
      Notify("No results found", "pWarn");
      if (import.meta.env.VITE_LOGGING) {
        console.error(err);
      }
    }
  };
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout/`,
        {},
        { withCredentials: true }
      );
      if (res.status == 200) {
        window.location.href = "/login";
      }
    } catch (error) {
      window.location.href = "/login";
    }
  };
  return (
    <>
      <Popup msg={popupMsg} popupType={popType} visible={pShowHide} />
      {/* <div className="searchRegionAdmin">
        {!expanded && (
          <div className="searchBarBox" onClick={expandSearchBox}>
            <span>
              <FontAwesomeIcon icon={faMagnifyingGlass} flip={"horizontal"} />
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
              fetchResults(query);
            }}
          />
        </div>
        <div className="searchCategories"></div>
      </div> */}
      <div className="logoutDiv">
        <ActionButton btnText={"Logout"} btnFun={handleLogout} />
      </div>
      <div className="adminHeaders">
        <p>Admin Panel</p>
      </div>
      <div className="searchProjectSuite">
        <div className="searchRegionAdmin">
          {!expanded && (
            <div className="searchBarBox" onClick={expandSearchBox}>
              <span>
                <FontAwesomeIcon icon={faMagnifyingGlass} flip={"horizontal"} />
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
                  setShowSearchExt(false);
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
                  setShowSearchExt(false);
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

      <div className="cardPageContainerBtmAdmin">
        {error && (
          <span>
            <Icon path={mdiFolderAlert} size={7} />
            <br></br>No project has been created
          </span>
        )}
        {projectData.map((item, index) => (
          <Card
            key={index}
            cardTags={item.card_tags}
            cardTitle={item.card_title}
            cardDescription={item.card_desc}
            cardBgImgUrl={item.card_img_url ? item.card_img_url : bgImage}
            cardGitLink={item.card_git_link}
            fromDate={prettifyDate(item.card_from_date)}
            isEditing={true}
            controller={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (import.meta.env.VITE_LOGGING) {
                console.log(item);
              }
              editController(
                formReactState,
                {
                  title: item.card_title,
                  desc: item.card_desc,
                  github_url: item.card_git_link,
                  tags: item.card_tags,
                  img_url: previewImgValue,
                  from_date: getISODate(item.card_from_date),
                },
                imageReactState,
                item.card_img_url,
                item.card_img_id,
                item.card_id || item._id,
                isEditBtnBool,
                isEditReactState,
                selectedFileValue,
                selectedFileReactState,
                setFormIdReactState,
                adminFormVisibleReactState
              );
            }}
            deleteController={() => {
              setShowDeletePopUP(true);
              // handleDelete(item.card_img_id, item.card_id);
              // confirmDelete(item);
              setDelItem(item);
            }}
            copyController={() => {
              copyControllerLogic(
                formReactState,
                {
                  card_title: item.card_title,
                  card_desc: item.card_desc,
                  card_git_link: item.card_git_link,
                  card_tags: item.card_tags,
                  card_img_id: item.card_img_id,
                  card_from_date: getISODate(item.card_from_date),
                },
                imageReactState,
                item.card_img_id,
                item.card_id,
                isEditBtnBool,
                isEditReactState,
                selectedFileValue,
                selectedFileReactState,
                setFormIdReactState,
                adminFormVisibleReactState
              );
            }}
          />
        ))}
        <span className="addBtn">
          <ActionButton
            btnText={<FontAwesomeIcon icon={faPlus} />}
            btnType={"active"}
            btnHType={"button"}
            btnFun={resetFormForAddProject}
          />
        </span>
      </div>
      {loading && <Skeleton isAdmin={true} />}
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
                fetchResultsExt(searchReq, true, newOffset);
              }}
            />
          )}
        </div>
      )}
      {/* <div className="loadMoreContainer">
        <ActionButton
          btnText={"Load more search"}
          btnFun={(e) => {
            setLoading(true);
            fetchResultsExt({}, true);
          }}
        />
      </div> */}
      {showDeletePopUP && (
        <div className="confirmDeleteBackdrop">
          <div className="confirmDeleteContainer">
            <div className="confirmDeleteHeader">
              <p className="confDelTitle">Confirm Delete?</p>
              <p className="confDelText">
                Are you sure to delete? This action cannot be undone.
              </p>
            </div>
            <ActionButton
              btnText={"Cancel"}
              btnType={"inactive"}
              btnHType={"button"}
              btnFun={() => {
                setShowDeletePopUP(false);
              }}
            />
            <ActionButton
              btnText={"Delete"}
              btnType={"active"}
              btnHType={"button"}
              btnFun={() => {
                handleDelete(
                  delItem.card_img_id,
                  delItem.card_id,
                  delItem.card_tags
                );
                setShowDeletePopUP(false);
                Notify("Post deleted", "pSuccess");
                setTimeout(() => {
                  location.reload();
                }, 3000);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AllProjectsAdmin;
