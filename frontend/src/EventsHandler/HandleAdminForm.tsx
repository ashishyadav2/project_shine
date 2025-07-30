import axios from "axios";
import { useState } from "react";
import bgImage from "../assets/image_placeholder.jpg";
import { HandlePopUp } from "./HandlePopUp";
export const useAdminFormHandler = () => {
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
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setActiveImgClass("imagePreviewActive");
      setFormData({ ...formData, img_url: previewURL });
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewURL(bgImage);
    setActiveImgClass("imagePreview");
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const partialFormData = new FormData();
    partialFormData.append("imageFile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/imageUpload/",
        partialFormData
      );
      console.log(response, "Image upload success");
      Notify("Image upload success", "pSuccess");
      setImageId(response.data._id);
      return response.data._id;
    } catch (err) {
      console.log(err);
      Notify("Image upload failed", "pError");
      setImageId("");
      return null;
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
    });
    setPreviewURL(bgImage);
    setImageId("");
    setFormFlag(false);
    setActiveImgClass("imagePreview");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditBtn) {
      console.log("edit mode");
      // Notify("Editing Mode");
      let isImageUploaded = false;
      let isImagePresent = selectedFile != null;
      let uploaded_image_id = null;
      if (isImagePresent) {
        uploaded_image_id = await handleUpload();
        isImageUploaded = uploaded_image_id != null;
        console.log(
          `${uploaded_image_id}| isImageUploaded-> ${isImageUploaded}`
        );
        if (isImageUploaded) {
          try {
            formData.img_url = formData.img_url + ":" + uploaded_image_id;
            const response = await axios.patch(
              `http://localhost:8000/api/${formId}/`,
              formData
            );
            console.log(response.data, "data updated");
            Notify("Image has been updated", "pSuccess");
            setTimeout(() => {
              location.reload();
            }, 2500);
          } catch (err) {
            console.log(err);
            Notify("Unable to update image", "pError");
          }
        }
      } else {
        try {
          const response = await axios.patch(
            `http://localhost:8000/api/${formId}/`,
            formData
          );
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
      // if (
      //   formData.title == "" ||
      //   formData.desc == "" ||
      //   formData.github_url == "" ||
      //   formData.tags == "" ||
      //   selectedFile === null
      // ) {
      //   console.log(formData.desc);
      //   Notify("Form fields cannot be empty!", "pWarn");
      //   console.log("Form fields cannot be empty");
      //   return;
      // }
      for (const [key, value] of Object.entries(formData)) {
        if (value == "" || value === null) {
          Notify(`${key.toUpperCase()} cannot be empty!`, "pWarn");
          console.log(`${key} cannot be empty!`);
          return;
        }
      }
      let uploaded_image_id = await handleUpload();
      console.log(uploaded_image_id);
      if (!uploaded_image_id) {
        console.log("image upload failed");
        Notify("Image upload failed", "pSuccess");
        return;
      }
      let data = {
        card_title: formData.title,
        card_desc: formData.desc,
        card_git_link: formData.github_url,
        card_tags: formatTags(formData.tags),
        card_img_id: uploaded_image_id,
      };
      console.log(data);
      if (uploaded_image_id) {
        axios
          .post("http://localhost:8000/api/", data)
          .then((response) => {
            if (response.status === 200) {
              setFormFlag(true);
              resetForm();
              // popup("Data inserted into database");
              console.log("Data inserted into database");
              Notify("Post created", "pSuccess");
              setTimeout(() => {
                location.reload();
              }, 2500);
            }
          })
          .catch((err) => {
            console.error(err);
            console.log("error in inserting into database");
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
  };
};
