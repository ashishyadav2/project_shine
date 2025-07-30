import React, { ChangeEventHandler } from "react";
interface InputFieldProps {
  type: string;
  fieldName?: string;
  color?: string;
  placeholder?: string;
  name?: string;
  enabled?: boolean;
  inputFunc?: ChangeEventHandler<HTMLInputElement>;
  value?: string | string[];
  accept?: string;
}
const InputField = ({
  type = "text",
  fieldName,
  color,
  placeholder,
  name,
  enabled = true,
  inputFunc,
  value,
  accept,
}: InputFieldProps) => {
  return (
    <div className="inputField">
      <label htmlFor={name}>{fieldName}</label>
      <input
        type={type}
        placeholder={placeholder && placeholder.length < 1 ? "" : placeholder}
        disabled={!enabled}
        name={name}
        onChange={inputFunc}
        value={value}
        accept={accept}
        id={name}
        title={fieldName}
      ></input>
    </div>
  );
};

export default InputField;
