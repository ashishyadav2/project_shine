import axios from "axios";
import { useState } from "react";
import bgImage from "../assets/image_placeholder.jpg";
import { HandlePopUp } from "./HandlePopUp";
import { pull } from "lodash";
import { utils } from "../jsUtils/utils";
export const useAdminFormHandler = () => {
  const { getISODate, strToDate } = utils();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState<string>(bgImage);
  const [activeImgClass, setActiveImgClass] = useState<string>("imagePreview");
  const [img_id, setImageId] = useState<string | "">("");
  const [formFlag, setFormFlag] = useState(false);
  const [isEditBtn, setIsEditBtn] = useState(false);
  const [formId, setFormId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    github_url: "",
    tags: "",
    img_url: "",
    from_date: "",
    old_img_id: "",
    new_img_id: "",
    is_img_removed: false,
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
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    console.log("file change: ", file);
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setActiveImgClass("imagePreviewActive");
      setFormData({ ...formData, img_url: previewURL, is_img_removed: false });
      console.log("selected file:", file);
    }
  };

  const handleRemove = () => {
    // if (isEditBtn) {
    //   Notify(
    //     "Image removal is not allowed. You can change image but cannot remove",
    //     "pError"
    //   );
    //   return;
    // }
    setSelectedFile(null);
    setPreviewURL(bgImage);
    setActiveImgClass("imagePreview");
    setFormData({
      ...formData,
      img_url: bgImage,
      new_img_id: "",
      is_img_removed: true,
    });
  };

  const handleUpload = async (): Promise<string> => {
    if (!selectedFile) return "";

    const partialFormData = new FormData();
    partialFormData.append("imageFile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/image/upload/",
        partialFormData,
        { withCredentials: true }
      );
      console.log(response, "Image upload success");
      Notify("Image uploaded successfully", "pSuccess");
      setImageId(response.data._id);
      return response.data._id;
    } catch (err) {
      console.log(err, "Unable to upload image");
      Notify("Unable to upload image", "pError");
      setImageId("");
      return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatTags = (tagString: string) => {
    return tagString.split(/\s*,\s*/);
  };
  const resetForm = () => {
    setFormData({
      title: "",
      desc: "",
      github_url: "",
      tags: "",
      img_url: "",
      from_date: "",
      old_img_id: "",
      new_img_id: "",
      is_img_removed: false,
    });
    setSelectedFile(null);
    setPreviewURL(bgImage);
    setActiveImgClass("imagePreview");
  };

  const validateFormFields = (isEditBtn: boolean) => {
    //validate each form field
    let formDataObj = Object.entries(formData).slice(0, 5);
    if (isEditBtn) {
      formDataObj = Object.entries(formData).slice(0, 5);
    }
    for (const [key, value] of formDataObj) {
      if (value == "" || value === null) {
        Notify(`${key.toUpperCase()} cannot be empty!`, "pWarn");
        console.log(`${key} cannot be empty!`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditBtn) {
      if (!validateFormFields(isEditBtn)) {
        return;
      }
      console.log("inside edit mode");
      // Notify("Editing Mode");
      let isImageUploaded = false;
      let isImagePresent = selectedFile != null;
      let uploaded_image_id = "";
      console.log(`uploaded_image_id: ${uploaded_image_id}`);
      console.log(`is image present: ${isImagePresent}`);
      if (isImagePresent) {
        uploaded_image_id = await handleUpload();
        isImageUploaded = uploaded_image_id != "";
        console.log(
          `${uploaded_image_id}| isImageUploaded-> ${isImageUploaded}`
        );
        console.log(`is image upload: ${isImageUploaded}`);
        if (isImageUploaded) {
          try {
            formData.new_img_id = uploaded_image_id;
            console.log(`form_data with image: ${formData}`);
            const response = await axios.patch(
              `http://localhost:8000/api/update_post/${formId}/`,
              formData,
              { withCredentials: true }
            );
            console.log(response.data, "data updated");
            Notify("Image has been updated", "pSuccess");
            setTimeout(() => {
              location.reload();
            }, 2500);
          } catch (err) {
            console.log(err, "not able to update image");
            Notify("Unable to update image", "pError");
          }
        }
      } else {
        try {
          // formData.from_date = `${strToDate(formData.from_date)}`;
          const response = await axios.patch(
            `http://localhost:8000/api/update_post/${formId}/`,
            formData,
            { withCredentials: true }
          );
          console.log("Edit mode", formData);
          console.log(response.data, "data updated");
          Notify("Post is updated", "pSuccess");
          setTimeout(() => {
            location.reload();
          }, 3000);
        } catch (err) {
          console.log(err);
          Notify("Unable to update post", "pError");
        }
      }
    } else {
      // inserting new post
      if (!validateFormFields(isEditBtn)) {
        return;
      }
      console.log("Add mode", formData);
      let uploaded_image_id = await handleUpload();
      console.log("uploaded image id", uploaded_image_id);
      if (!uploaded_image_id) {
        Notify("Cannot upload image", "pError");
        return;
      }
      let data = {
        card_title: formData.title,
        card_desc: formData.desc,
        card_git_link: formData.github_url,
        card_tags: formatTags(formData.tags),
        card_img_id: uploaded_image_id,
        card_from_date: formData.from_date,
      };
      console.log("Add mode form data", data);
      if (uploaded_image_id != "") {
        axios
          .post("http://localhost:8000/api/view_create_post/", data)
          .then((response) => {
            if (response.status === 200) {
              setFormFlag(true);
              resetForm();
              console.log("Data inserted into database");
              Notify("Post created", "pSuccess");
              setTimeout(() => {
                location.reload();
              }, 2500);
            }
          })
          .catch((err) => {
            console.error(err);
            console.log("Error in inserting into database");
            Notify("Unable to create post", "pError");
          });
      }
    }
  };
  return {
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
  };
};
