import { Search, X, ChevronDown, Check } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const Select2 = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  isMulti = false,
  className = "",
  maxHeight = "max-h-60",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (isMulti) {
      const isSelected = value.some((item) => item.value === option.value);

      if (isSelected) {
        onChange(value.filter((item) => item.value !== option.value));
      } else {
        onChange([...value, option]);
      }
    } else {
      onChange([option]);
      setIsOpen(false);
    }

    if (!isMulti) {
      setSearchTerm("");
    }
  };

  const removeOption = (optionToRemove, e) => {
    e.stopPropagation();
    onChange(value.filter((option) => option.value !== optionToRemove.value));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const isOptionSelected = (option) => {
    return value.some((item) => item.value === option.value);
  };

  return (
    <div className={`relative z-10 ${className}`} ref={dropdownRef}>
      {/* Main select box */}
      <div
        className="flex min-h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length > 0 ? (
            isMulti ? (
              <div className="flex flex-wrap gap-1">
                {value.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm"
                  >
                    <span>{option.label}</span>
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-600"
                      onClick={(e) => removeOption(option, e)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <span>{value[0]?.label}</span>
            )
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Search box */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} />
              </div>
              <input
                ref={searchInputRef}
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder={searchPlaceholder}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options list */}
          <div className={`overflow-auto ${maxHeight}`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    isOptionSelected(option) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {isMulti && (
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded border border-gray-300">
                      {isOptionSelected(option) && (
                        <Check size={12} className="text-blue-600" />
                      )}
                    </div>
                  )}
                  <span>{option.label}</span>
                  {!isMulti && isOptionSelected(option) && (
                    <Check size={16} className="ml-auto text-blue-600" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-center">
                Tidak ada hasil
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Select2;
