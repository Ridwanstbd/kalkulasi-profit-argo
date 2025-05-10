import React from "react";

const Select = ({
  name,
  value,
  onChange,
  options,
  className = "",
  ariaLabel = "Select option",
  disabled = false,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`block px-2 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
export default Select;
