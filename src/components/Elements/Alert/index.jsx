import React, { useState } from "react";
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

const Alert = ({
  message,
  type = "error",
  dismissible = true,
  icon = true,
  className = "",
  onDismiss,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  const configs = {
    error: {
      bgColor: "bg-red-100",
      borderColor: "border-red-400",
      textColor: "text-red-700",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    warning: {
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-700",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    info: {
      bgColor: "bg-blue-100",
      borderColor: "border-blue-400",
      textColor: "text-blue-700",
      icon: <Info className="h-5 w-5" />,
    },
    success: {
      bgColor: "bg-green-100",
      borderColor: "border-green-400",
      textColor: "text-green-700",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  };

  const {
    bgColor,
    borderColor,
    textColor,
    icon: AlertIcon,
  } = configs[type] || configs.error;

  return (
    <div
      className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded relative mb-4 flex items-center ${className}`}
      role="alert"
    >
      {icon && <span className="mr-2">{AlertIcon}</span>}
      <span className="flex-grow">{message}</span>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
