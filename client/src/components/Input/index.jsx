import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import "./input.css";

const Input = ({
  inputRef,
  label,
  type,
  name,
  placeholder,
  value,
  setValue,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = event => {
    event.preventDefault();
    setShowPassword(prevValue => !prevValue);
  };

  const handleChange = event => {
    if (!setValue) return; // That means this Input uses ref
    const { name, value } = event.target;

    setValue(prevValue => ({ ...prevValue, [name]: value }));
  };

  return (
    <label>
      <span className="form--label--wrapper">
        {label}
        {type === "password" && (
          <span className="form--password--icon" onClick={toggleShowPassword}>
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </span>
        )}
      </span>
      <input
        ref={inputRef}
        type={showPassword ? "text" : type}
        name={name}
        className="form--input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </label>
  );
};

export default Input;
