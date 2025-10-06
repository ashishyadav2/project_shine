import { useState } from "react";
import bgImage from "../assets/image_placeholder.jpg";
import axios from "axios";

export const HandleImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState<string>(bgImage);
  const [activeImgClass, setActiveImgClass] = useState<string>("imagePreview");
  const [img_id, setImageId] = useState<string | "">("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setActiveImgClass("imagePreviewActive");
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
        `${import.meta.env.VITE_BACKEND_URL}/imageUpload/`,
        partialFormData,
        { withCredentials: true }
      );
      if (import.meta.env.VITE_LOGGING) {
        console.log(response, "Image upload success");
      }
      setImageId(response.data._id);
      return img_id;
    } catch (err) {
      if (import.meta.env.VITE_LOGGING) {
        console.error(err);
      }
      return null;
    }
  };
  return {
    previewURL,
    activeImgClass,
    img_id,
    handleFileChange,
    handleRemove,
    handleUpload,
  };
};
