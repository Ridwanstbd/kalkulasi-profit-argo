import React from "react";

const TableHeader = ({
  children,
  onClick,
  isSortable = false,
  sortDirection = null,
  className,
}) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
        isSortable ? "cursor-pointer select-none" : ""
      } ${className}`}
      onClick={`${isSortable ? onClick : undefined}`}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {isSortable && (
          <span className="inline-flex flex-col">
            <ChevronUp
              size={3}
              className={`${
                sortDirection === "asc" ? "text-blue-600" : "text-gray-400"
              }`}
            />
            <ChevronDown
              size={3}
              className={`${
                sortDirection === "desc" ? "text-blue-600" : "text-gray-400"
              }`}
            />
          </span>
        )}
      </div>
    </th>
  );
};
export default TableHeader;
