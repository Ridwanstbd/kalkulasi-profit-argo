import React from "react";
import TableCell from "./TableCell";

const TableRow = ({
  data,
  columns,
  isSelect = false,
  onRowClick = null,
  className = "",
}) => {
  return (
    <tr
      className={`${isSelect ? "bg-blue-50" : "bg-white hover:bg-gray-50"} ${
        onRowClick ? "cursor-pointer" : ""
      } transition-colors duration-150 ease-in-out ${className}`}
      onClick={onRowClick ? () => onRowClick(data) : undefined}
    >
      {columns.map((column) => (
        <TableCell
          key={column.key || column.accessor}
          className={column.cellClassName || ""}
        >
          {column.cell ? column.cell(data) : data[column.accessor]}
        </TableCell>
      ))}
    </tr>
  );
};

export default TableRow;
