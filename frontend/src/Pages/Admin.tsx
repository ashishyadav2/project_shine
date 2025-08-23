import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import ActionButton from "../components/ActionButton";
import { useAdminFormHandler } from "../EventsHandler/HandleAdminForm";
import AllProjectsAdmin from "../components/AllProjectsAdmin";
import Popup from "../Utilities/Popup";
import { HandlePopUp } from "../EventsHandler/HandlePopUp";
import popup from "../Utilities/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faFloppyDisk,
  faFolderOpen,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
const Admin = () => {
  const [isAdminFormVisible, setIsAdminFormVisible] = useState("adminForm");

  const {
    formData,
    img_id,
    activeImgClass,
    previewURL,
    isEditBtn,
    selectedFile,
    handleChange,
    handleSubmit,
    handleFileChange,
    handleRemove,
    setFormData,
    setPreviewURL,
    setIsEditBtn,
    setSelectedFile,
    setFormId,
    popType,
    popupMsg,
    pShowHide,
    Notify,
    formFlag,
  } = useAdminFormHandler();
  const [tagsArr, setTagsArr] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState<string>("");
  let fetchedTags: string[] = [];
  const handleKeyDown = (e: any) => {
    if (e.key === "," && tagInputValue.trim() !== "") {
      e.preventDefault();
      const tag = tagInputValue.trim();
      const tagRegex = /^[a-z]+$/g;
      if (!tagRegex.test(tag)) {
        Notify("Invalid tag format. Only alphabets are allowed", "pWarn");
        setTagInputValue("");
        return;
      }
      if (tag === "") {
        Notify("Tag cannot be blank", "pWarn");
        return;
      } else if (tagsArr.length >= 7) {
        Notify("Max tag limit reached", "pWarn");
        return;
      }
      if (!tagsArr.includes(tag)) {
        if (tag.length > 15) {
          Notify("A tag cannot have more than 15 characters", "pWarn");
          return;
        }
        const updatedTags = [...tagsArr, tag];
        setTagsArr(updatedTags);
        setFormData({ ...formData, tags: updatedTags.join(",") });
        // console.log(formData);
      } else {
        Notify(`'${tag}' tag already exists`, "pWarn");
      }
      setTagInputValue("");
    }
  };
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputValue(e.target.value.trim());
  };
  const removeTag = (index: any) => {
    const updatedTags = tagsArr.filter((_, i) => i !== index);
    setTagsArr(updatedTags);
    setFormData({ ...formData, tags: updatedTags.join(",") });
  };
  useEffect(() => {
    if (isEditBtn && formData.tags) {
      const existingTags = formData.tags
        .toString()
        .split(",")
        .filter((t) => t.trim() !== "");
      setTagsArr(existingTags);
    }
    if (!formData.tags) {
      setTagsArr([]);
    }
  }, [isEditBtn, formData.tags]);
  return (
    <>
      <Popup msg={popupMsg} popupType={popType} visible={pShowHide} />

      <div className="adminFormContainer">
        <AllProjectsAdmin
          formReactState={setFormData}
          formDataValue={formData}
          imageReactState={setPreviewURL}
          isEditBtnBool={isEditBtn}
          isEditReactState={setIsEditBtn}
          selectedFileValue={selectedFile}
          selectedFileReactState={setSelectedFile}
          setFormIdReactState={setFormId}
          previewImgValue={previewURL}
          adminFormVisibleReactState={setIsAdminFormVisible}
        />
        {/* <div
          className={
            isAdminFormVisible != "adminForm" ? "adminFormBackdrop" : ""
          }
        > */}
        <form
          method="post"
          className={isAdminFormVisible}
          onSubmit={handleSubmit}
        >
          <ActionButton
            btnText={<FontAwesomeIcon icon={faClose} />}
            btnHType="button"
            btnType="inactive"
            btnFun={() => {
              setIsAdminFormVisible("adminForm");
            }}
          />
          <div className="adminFormHeader">
            {isEditBtn ? "Edit Project" : "Add Project"}
          </div>
          <div className="adminLRContainer">
            <div className="adminLeft">
              <InputField
                type="text"
                fieldName="Title"
                inputFunc={handleChange}
                value={formData.title}
                name="title"
              />
              {/* <InputField
                type="text"
                fieldName="Description"
                inputFunc={handleChange}
                value={formData.desc}
                name="desc"
              /> */}
              <div className="inputField">
                <label htmlFor="desc">Description</label>
                <textarea
                  name="desc"
                  maxLength={256}
                  rows={8}
                  onChange={handleChange}
                  value={formData.desc}
                ></textarea>
              </div>

              <InputField
                type="url"
                fieldName="Github Link"
                inputFunc={handleChange}
                value={formData.github_url}
                name="github_url"
              />
              <div className="tagsBuilder">
                <label htmlFor="tags">Tags</label>
                <div className="tagsHolder">
                  {tagsArr.map((tagName, index) => (
                    <span key={index}>
                      {tagName}
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          removeTag(index);
                        }}
                      >
                        {<FontAwesomeIcon icon={faXmark} />}
                      </button>
                    </span>
                  ))}
                </div>
                <div className="inputField">
                  <input
                    type="text"
                    name="tags"
                    onChange={handleTagInputChange}
                    value={formFlag ? "" : tagInputValue}
                    id="tags"
                    title="Tags"
                    onKeyDown={handleKeyDown}
                  ></input>
                </div>
                {/* <InputField
                  type="text"
                  fieldName="Tags"
                  inputFunc={handleChange}
                  value={formData.tags}
                  name="tags"
                /> */}
              </div>
            </div>
            <div className="adminRight">
              <div className="imageUploadContainer">
                <div className={activeImgClass}>
                  <img src={previewURL} alt="Uploaded image" />
                </div>
                <div className="imageControls">
                  <input
                    type="file"
                    id="imageInput"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="imageInput" className="activeActionBtn">
                    {<FontAwesomeIcon icon={faFolderOpen} />}
                    <span className="ml-1">Browse</span>
                  </label>
                  <span className={selectedFile || isEditBtn ? "" : "hidden"}>
                    <ActionButton
                      btnText={<FontAwesomeIcon icon={faTrashCan} />}
                      btnType={"inactive"}
                      btnFun={handleRemove}
                      btnHType={"button"}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isEditBtn ? (
            <ActionButton
              btnText={
                <span>{<FontAwesomeIcon icon={faFloppyDisk} />} Update</span>
              }
              btnHType="submit"
              btnType="active"
            />
          ) : (
            <ActionButton
              btnText={
                <span>{<FontAwesomeIcon icon={faFloppyDisk} />} Save</span>
              }
              btnHType="submit"
              btnType="active"
            />
          )}

          {/* <InputField
          type="hidden"
          name="img_id"
          value={formData.img_id}
          inputFunc={handleChange}
        /> */}
          <input type="hidden" name="img_id" value={img_id} />
        </form>
        {/* </div> */}
      </div>
    </>
  );
};

export default Admin;
