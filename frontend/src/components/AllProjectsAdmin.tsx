import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import { useProjectPageData } from "../EventsHandler/HandleProjectsPage";
import { HandleAllProjectsAdmin } from "../EventsHandler/HandleAllProjectsAdmin";
import InputField from "./InputField";
import ActionButton from "./ActionButton";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";
import axios from "axios";
import bgImage from "../assets/image_placeholder.jpg";
import { HandlePopUp } from "../EventsHandler/HandlePopUp";
import Popup from "../Utilities/Popup";

interface AllProjectsAdminProps {
  formReactState: React.Dispatch<
    React.SetStateAction<{
      title: string;
      desc: string;
      github_url: string;
      tags: string;
      img_url: string;
    }>
  >;
  formDataValue: {
    title: string;
    desc: string;
    github_url: string;
    tags: string;
    img_url: string;
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
  const { projectData, loading, error, getProjectData } = useProjectPageData();
  const { editController, handleDelete } = HandleAllProjectsAdmin();

  useEffect(() => {
    getProjectData();
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDeletePopUP, setShowDeletePopUP] = useState(false);
  const [delItem, setDelItem] = useState({ card_img_id: "", card_id: "" });
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
    });
    selectedFileReactState(null);
    imageReactState(bgImage);
  };

  const fetchResults = async (searchText: string) => {
    if (!searchText) return setResults([]);
    try {
      const res = await axios.get(
        `http://localhost:8000/search/?q=${searchText}/`
      );
      setResults(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  // const confirmDelete = (item: any) => {
  //   handleDelete(item.card_img_id, item.card_id);
  //   setShowDeletePopUP(true);
  // };
  // const fetchResults = debounce(async (searchText) => {
  //   if (!searchText) return setResults([]);
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8000/search/?q=${searchText}/`
  //     );
  //     setResults(res.data);
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, 300);

  return (
    <>
      <Popup msg={popupMsg} popupType={popType} visible={pShowHide} />
      <div className="searchRegionAdmin">
        <div className="searchBar">
          <InputField
            type={"search"}
            placeholder={"Search"}
            value={query}
            inputFunc={(e) => {
              if (e.target.value.length == 0) {
                setResults([]);
              }
              setQuery(e.target.value);
            }}
          />
          <ActionButton
            btnText={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            btnType={"active"}
            btnFun={() => {
              fetchResults(query);
            }}
          />
        </div>
        <div className="searchCategories"></div>
      </div>
      <div className="cardPageContainerBtmAdmin">
        {(query && results.length > 0 ? results : projectData).map(
          (item, index) => (
            <Card
              key={index}
              cardTags={item.card_tags}
              cardTitle={item.card_title}
              cardDescription={item.card_desc}
              cardBgImgUrl={item.card_img_id ? item.card_img_id : bgImage}
              cardGitLink={item.card_git_link}
              isEditing={true}
              controller={() => {
                editController(
                  formReactState,
                  {
                    title: item.card_title,
                    desc: item.card_desc,
                    github_url: item.card_git_link,
                    tags: item.card_tags,
                    img_url: previewImgValue,
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
              deleteController={() => {
                setShowDeletePopUP(true);
                // handleDelete(item.card_img_id, item.card_id);
                // confirmDelete(item);
                setDelItem(item);
              }}
            />
          )
        )}
        <ActionButton
          btnText={<FontAwesomeIcon icon={faPlus} />}
          btnType={"active"}
          btnHType={"button"}
          btnFun={resetFormForAddProject}
        />
      </div>
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
                handleDelete(delItem.card_img_id, delItem.card_id);
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
