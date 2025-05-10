import React from "react";

const TableHead = ({ columns, sortColumn, sortDirection, onSort }) => {
  const handleSort = (accessor) => {
    if (onSort) {
      let direction = "asc";
      if (sortColumn === accessor) {
        direction = sortDirection === "asc" ? "desc" : "asc";
      }
      onSort(accessor, direction);
    }
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key || column.accessor}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? "cursor-pointer" : ""
            } ${column.headerClassName || ""}`}
            onClick={() => column.sortable && handleSort(column.accessor)}
          >
            <div className="flex items-center">
              {column.name}
              {column.sortable && sortColumn === column.accessor && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
