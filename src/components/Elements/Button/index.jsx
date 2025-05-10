import React from "react";

const Button = ({
  children,
  onClick,
  variant,
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded focus:outline-none transition-colors";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-opacity-50",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50",
  };

  const sizes = {
    sm: "py-1 px-2 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-2 px-6 text-base",
  };

  const disabledStyle = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${disabledStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
