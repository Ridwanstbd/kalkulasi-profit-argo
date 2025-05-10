import React from "react";
import Button from "../Button";

const TableActions = ({
  row,
  onDetail,
  onEdit,
  onDelete,
  showDetail = true,
  showEdit = true,
  showDelete = true,
  detailLabel = "Detail",
  editLabel = "Ubah",
  deleteLabel = "Hapus",
  className = "",
  size = "sm",
  disabled = false,
  detailDisabled = false,
  editDisabled = false,
  deleteDisabled = false,
}) => {
  // Handler untuk tombol detail
  const handleDetail = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    if (onDetail) {
      onDetail(row);
    }
  };

  // Handler untuk tombol edit
  const handleEdit = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    if (onEdit) {
      onEdit(row);
    }
  };

  // Handler untuk tombol hapus
  const handleDelete = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    if (onDelete) {
      onDelete(row.id || row); // Bisa menggunakan ID atau seluruh objek row
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {/* Tombol Detail */}
      {showDetail && (
        <Button
          variant="primary"
          size={size}
          onClick={handleDetail}
          disabled={disabled || detailDisabled}
        >
          {detailLabel}
        </Button>
      )}

      {/* Tombol Edit/Ubah */}
      {showEdit && (
        <Button
          variant="success"
          size={size}
          onClick={handleEdit}
          disabled={disabled || editDisabled}
        >
          {editLabel}
        </Button>
      )}

      {/* Tombol Hapus */}
      {showDelete && (
        <Button
          variant="danger"
          size={size}
          onClick={handleDelete}
          disabled={disabled || deleteDisabled}
        >
          {deleteLabel}
        </Button>
      )}
    </div>
  );
};

export default TableActions;
