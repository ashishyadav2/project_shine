import React, { useState } from "react";
import InputField from "../components/InputField";
import ActionButton from "../components/ActionButton";
import { useAdminFormHandler } from "../EventsHandler/HandleAdminForm";
import AllProjectsAdmin from "../components/AllProjectsAdmin";
import Popup from "../Utilities/Popup";
import { HandlePopUp } from "../EventsHandler/HandlePopUp";
import popup from "../Utilities/Popup";
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
  } = useAdminFormHandler();
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
        <form
          method="post"
          className={isAdminFormVisible}
          onSubmit={handleSubmit}
        >
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
                <div className="tagsHolder">
                  <span>HTMl</span>
                  <span>CSS</span>
                  <span>JS</span>
                </div>
                <InputField
                  type="text"
                  fieldName="Tags"
                  inputFunc={handleChange}
                  value={formData.tags}
                  name="tags"
                />
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
                    Choose Image
                  </label>
                  <ActionButton
                    btnText={"Remove"}
                    btnType={"inactive"}
                    btnFun={handleRemove}
                    btnHType={"button"}
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditBtn ? (
            <ActionButton btnText="Update" btnHType="submit" btnType="active" />
          ) : (
            <ActionButton btnText="Save" btnHType="submit" btnType="active" />
          )}
          <ActionButton
            btnText="Close"
            btnHType="button"
            btnType="inactive"
            btnFun={() => {
              setIsAdminFormVisible("adminForm");
            }}
          />
          {/* <InputField
          type="hidden"
          name="img_id"
          value={formData.img_id}
          inputFunc={handleChange}
        /> */}
          <input type="hidden" name="img_id" value={img_id} />
        </form>
      </div>
    </>
  );
};

export default Admin;
