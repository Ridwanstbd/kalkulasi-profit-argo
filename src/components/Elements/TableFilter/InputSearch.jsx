import { Search } from "lucide-react";
import React from "react";

const InputSearch = ({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
  ariaLabel = "Search",
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={20} />
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        className={`block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  );
};
export default InputSearch;
