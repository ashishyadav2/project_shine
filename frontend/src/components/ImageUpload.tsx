import { useState } from "react";
import ActionButton from "./ActionButton";
import InputField from "./InputField";
import LinkTag from "./LinkTag";
import { data } from "react-router-dom";
import axios from "axios";
import { HandleImageUpload } from "../EventsHandler/HandleImageUpload";

interface ImageUploadProps {
  previewURL: string;
  activeImgClass: string;
  img_id: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemove: () => void;
  handleUpload: () => void;
}
function ImageUpload({
  previewURL,
  activeImgClass,
  img_id,
  handleFileChange,
  handleRemove,
  handleUpload,
}: ImageUploadProps) {
  return (
    <>
      <div className="imageUploadContainer">
        <div className={activeImgClass}>
          <img src={previewURL} alt="Uploaded image" />
        </div>
        <div className="imageControls">
          {/* <ActionButton
            btnText={"Choose file"}
            btnType={"active"}
            btnFun={handleUpload}
            btnHType={"button"}
          /> */}
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
    </>
  );
}
export default ImageUpload;
