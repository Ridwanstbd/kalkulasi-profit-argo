import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Dropdown = ({
  trigger,
  children,
  position = "bottom-right",
  width = 200,
  showChevron = true,
  style = {},
  className = "",
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPositionStyle = () => {
    const positionStyle = {};

    if (position.includes("right")) {
      positionStyle.right = 0;
    } else if (position.includes("left")) {
      positionStyle.left = 0;
    } else if (position.includes("center")) {
      positionStyle.left = "50%";
      positionStyle.transform = "translateX(-50%)";
    }

    if (position.includes("bottom")) {
      positionStyle.top = "100%";
      positionStyle.marginTop = "8px";
    } else if (position.includes("top")) {
      positionStyle.bottom = "100%";
      positionStyle.marginBottom = "8px";
    }

    return positionStyle;
  };

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState && onOpen) {
      onOpen();
    } else if (!newState && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (isOpen && onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="cursor-pointer flex items-center"
      >
        {trigger}
        {showChevron && (
          <ChevronDown
            size={16}
            className={`transition-transform ml-1 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 ${className}`}
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            ...getPositionStyle(),
            ...style,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Dropdown.Item = ({ children, onClick, icon, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

Dropdown.Header = ({ children, className = "" }) => {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

Dropdown.Divider = ({ className = "" }) => {
  return <div className={`border-t border-gray-100 my-1 ${className}`}></div>;
};

export default Dropdown;
