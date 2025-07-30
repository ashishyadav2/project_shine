import { useState } from "react";
import axios from "axios";
import bgImage from "../assets/image_placeholder.jpg";

export const HandleAllProjectsAdmin = () => {
  const editController = async (
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
    formReactState(formDataValue);
    imageReactState(imageId ? imageId : bgImage);
    console.log(imageId);
    console.log(formDataValue);
    console.log(formId);
    console.log(isEditBtnBool);
    console.log(selectedFileValue);
    isEditReactState(true);
    selectedFileReactState(selectedFileValue);
    setFormIdReactState(formId);
    adminFormVisibleReactState("adminFormShow");
  };

  const handleDelete = async (img_id: string, card_id: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/delete/`, {
        data: {
          img_id,
          card_id,
        },
      });
      console.log(response.data, "data deleted");
    } catch (err) {
      console.log(err);
    }
  };
  return { editController, handleDelete };
};
