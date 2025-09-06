import { useState } from "react";
import axios from "axios";
import bgImage from "../assets/image_placeholder.jpg";
import { HandlePopUp } from "./HandlePopUp";

export const HandleAllProjectsAdmin = () => {
  const {
    popType,
    setPopupType,
    popupMsg,
    setPopupMsg,
    pShowHide,
    setPShowHide,
    Notify,
  } = HandlePopUp();
  const editController = async (
    formReactState: React.Dispatch<React.SetStateAction<any>>,
    formDataValue: object,
    imageReactState: React.Dispatch<React.SetStateAction<string>>,
    imageUrl: string,
    imageId: string,
    formId: string,
    isEditBtnBool: boolean,
    isEditReactState: React.Dispatch<React.SetStateAction<boolean>>,
    selectedFileValue: null,
    selectedFileReactState: React.Dispatch<React.SetStateAction<null>>,
    setFormIdReactState: React.Dispatch<React.SetStateAction<string>>,
    adminFormVisibleReactState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    formReactState({ ...formDataValue, old_img_id: imageId });
    imageReactState(imageUrl ? imageUrl : bgImage);
    isEditReactState(true);
    selectedFileReactState(selectedFileValue);
    setFormIdReactState(formId);
    adminFormVisibleReactState("adminFormShow");
    console.log("image id:", imageId);
    console.log(formDataValue);
    console.log("form id: ", formId);
    console.log("is editing mode", isEditBtnBool);
    console.log("Image file", selectedFileValue);
  };

  const handleDelete = async (
    img_id: string,
    card_id: string,
    card_tags: string[]
  ) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete_post/`,
        {
          data: {
            img_id,
            card_id,
            card_tags,
          },
        }
      );
      console.log(response.data, "data deleted");
    } catch (err) {
      console.log(err);
    }
  };
  const copyControllerLogic = async (
    formReactState: React.Dispatch<React.SetStateAction<any>>,
    formDataValue: object,
    imageReactState: React.Dispatch<React.SetStateAction<string>>,
    imageId: string,
    formId: string,
    isEditBtnBool: boolean,
    isEditReactState: React.Dispatch<React.SetStateAction<boolean>>,
    selectedFileValue: null,
    selectedFileReactState: React.Dispatch<React.SetStateAction<null>>,
    setFormIdReactState: React.Dispatch<React.SetStateAction<string>>,
    adminFormVisibleReactState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    Object.assign(formDataValue, { isCopyMode: true });
    console.log(formDataValue);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/view_create_post/",
        formDataValue
      );
      console.log(response, "Copy created");
      Notify("Copy Created", "pSuccess");
    } catch (err) {
      console.log(err);
      console.log("Error in copy creation");
      Notify("Unable to create", "pError");
    }
  };
  return { editController, handleDelete, copyControllerLogic };
};
