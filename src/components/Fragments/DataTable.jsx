import React from "react";
import TableFilter from "../Elements/TableFilter";
import TableHead from "../Elements/TableHead";
import TableRow from "../Elements/TableRow";
import Pagination from "../Elements/Pagination";
import { useEffect, useState, useMemo } from "react";

const DataTable = ({
  data = [],
  columns = [],
  pagination = true,
  filterable = true,
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onRowClick = null,
  className = "",
  emptyMessage = "Belum Ada Data",
  loadingMessage = "Loading data ...",
  responsive = true,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) => {
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(pageSize);
  const [showResponsiveView, setShowResponsiveView] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchTerm]);

  // Check screen size and set responsive view
  useEffect(() => {
    const handleResize = () => {
      setShowResponsiveView(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filterableColumns = useMemo(() => {
    return columns.filter((column) => column.filterable !== false);
  }, [columns]);

  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filtering
    if (searchTerm) {
      result = result.filter((item) => {
        // Search in all filterable columns
        return filterableColumns.some((column) => {
          const value = item[column.accessor];
          return (
            value &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      });
    }
    if (sortColumn) {
      result.sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        // Handle null or undefined values
        if (valueA === null || valueA === undefined) valueA = "";
        if (valueB === null || valueB === undefined) valueB = "";

        // Convert to strings for comparison
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();

        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortColumn, sortDirection, filterableColumns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;

    const startIndex = (currentPage - 1) * currentPageSize;
    return processedData.slice(startIndex, startIndex + currentPageSize);
  }, [processedData, currentPage, currentPageSize, pagination]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(processedData.length / currentPageSize));
  }, [processedData, currentPageSize]);

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    onPageSizeChange(size);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Regular table view
  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-10 text-center text-gray-500"
          >
            {loadingMessage}
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-10 text-center text-gray-500"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    // Add row number to each row for display
    return paginatedData.map((row, index) => {
      const rowWithNumber = {
        ...row,
        rowNumber: index + 1 + (currentPage - 1) * currentPageSize,
      };

      return (
        <TableRow
          key={row.id || index}
          data={rowWithNumber}
          columns={columns}
          onRowClick={onRowClick}
        />
      );
    });
  };

  // Card-style view for mobile
  const renderCardView = () => {
    if (loading) {
      return (
        <div className="p-4 text-center text-gray-500">{loadingMessage}</div>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
      );
    }

    // Extract action column if present
    const actionColumn = columns.find(
      (col) => col.key === "button-actions" || col.accessor === "actions"
    );

    return paginatedData.map((row, rowIndex) => {
      // Add row number to each row for display
      const rowWithNumber = {
        ...row,
        rowNumber: rowIndex + 1 + (currentPage - 1) * currentPageSize,
      };

      // Find all non-action columns
      const dataColumns = columns.filter(
        (col) =>
          col.key !== "button-actions" &&
          col.accessor !== "actions" &&
          !col.hidden
      );

      return (
        <div
          key={row.id || rowIndex}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
        >
          {/* Display data columns */}
          {dataColumns.map((column, colIndex) => {
            if (!column.accessor) return null;

            const value = rowWithNumber[column.accessor];
            let displayValue = value;

            // Use Cell renderer if provided
            if (column.cell) {
              displayValue = column.cell(
                rowWithNumber,
                rowIndex,
                paginatedData
              );
            }

            return (
              <div key={colIndex} className="mb-3 last:mb-0">
                <div className="text-sm font-medium text-gray-500">
                  {column.name || column.Header}
                </div>
                <div className="mt-1">{displayValue}</div>
              </div>
            );
          })}

          {/* Action buttons at bottom of card */}
          {actionColumn && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              {actionColumn.cell ? actionColumn.cell(rowWithNumber) : null}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`${className}`}>
      {filterable && (
        <TableFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          className="mb-4"
        />
      )}

      {showResponsiveView && responsive ? (
        // Card view for mobile
        <div className="space-y-4">{renderCardView()}</div>
      ) : (
        // Regular table view
        <div className="overflow-hidden border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHead
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableContent()}
            </tbody>
          </table>
        </div>
      )}

      {pagination && processedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={currentPageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default DataTable;
