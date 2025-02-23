import React from "react";
interface InputFieldProps {
  type: string;
  fieldName?: string;
  color?: string;
  placeholder?: string;
  enabled?: boolean;
}
const InputField = ({
  type = "text",
  fieldName,
  color,
  placeholder,
  enabled = true,
}: InputFieldProps) => {
  return (
    <div className="inputField">
      <span>{fieldName}</span>
      <input
        type={type}
        placeholder={placeholder && placeholder.length < 1 ? "" : placeholder}
        disabled={!enabled}
      ></input>
    </div>
  );
};

export default InputField;
