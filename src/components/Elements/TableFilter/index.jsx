import React from "react";
import InputSearch from "./InputSearch";

const TableFilter = ({
  searchTerm,
  onSearchChange,
  filterColumn,
  filterColumns = [],
  onFilterColumnChange,
  className = "",
}) => {
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };
  const handleFilterColumnChange = (e) => {
    onFilterColumnChange(e.target.value);
  };
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="flex-1">
        <InputSearch
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full"
        />
      </div>

      {filterColumns.length > 0 && (
        <div className="w-full sm:w-48">
          <Select
            value={filterColumn}
            onChange={handleFilterColumnChange}
            options={[
              { value: "all", label: "All Columns" },
              ...filterColumns.map((column) => ({
                value: column.accessor,
                label: column.name,
              })),
            ]}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
export default TableFilter;
