import React from "react";
import InputField from "../components/InputField";

const Admin = () => {
  return (
    <div>
      <InputField type="text" fieldName="Title" />
      <InputField type="text" fieldName="Description" />
      <InputField type="url" fieldName="Github Link" />
      <InputField type="text" fieldName="Tags" />
    </div>
  );
};

export default Admin;
