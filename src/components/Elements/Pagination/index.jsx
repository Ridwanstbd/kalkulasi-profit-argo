import React from "react";
import Button from "../Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "../Select/Select";

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className = "",
}) => {
  const handlePageSizeChange = (e) => {
    onPageSizeChange(Number(e.target.value));
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (endPage - startPage + 1 < 3 && totalPages > 2) {
      if (startPage === 1) {
        endPage = Math.min(3, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 2);
      }
    }

    for (let index = startPage; index <= endPage; index++) {
      pageNumbers.push(
        <Button
          key={index}
          variant={currentPage === index ? "primary" : "ghost"}
          size="sm"
          onClick={() => onPageChange(index)}
        >
          {index}
        </Button>
      );
    }
    return pageNumbers;
  };
  return (
    <div
      className={`flex flex-wrap items-center justify-between mt-4 ${className}`}
    >
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <span>Baris</span>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          options={pageSizeOptions.map((size) => ({
            value: size,
            label: size,
          }))}
          className="w-16"
        >
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
        </Select>
      </div>
      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={3} />
        </Button>
        <div className="hidden sm:flex space-x-1">{renderPageNumbers()}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={3} />
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
