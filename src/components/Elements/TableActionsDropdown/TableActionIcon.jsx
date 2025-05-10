import React from "react";

const IconButton = ({
  icon,
  color = "gray",
  onClick,
  title = "",
  disabled = false,
  className = "",
}) => {
  // Definisi warna berdasarkan parameter
  const colors = {
    gray: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
    blue: "text-blue-500 hover:text-blue-700 hover:bg-blue-100",
    green: "text-green-500 hover:text-green-700 hover:bg-green-100",
    red: "text-red-500 hover:text-red-700 hover:bg-red-100",
    yellow: "text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100",
  };

  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type="button"
      className={`p-1.5 rounded-full ${colors[color]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 ${disabledClass} ${className}`}
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      aria-label={title}
    >
      {icon}
    </button>
  );
};
const TableActionsIcon = ({
  row,
  onDetail,
  onEdit,
  onDelete,
  showDetail = true,
  showEdit = true,
  showDelete = true,
  detailTitle = "Lihat Detail",
  editTitle = "Edit Data",
  deleteTitle = "Hapus Data",
  detailIcon = null,
  editIcon = null,
  deleteIcon = null,
  className = "",
  disabled = false,
  detailDisabled = false,
  editDisabled = false,
  deleteDisabled = false,
}) => {
  // Handler untuk ikon
  const handleDetail = (e) => {
    e.stopPropagation();
    if (onDetail && !disabled && !detailDisabled) {
      onDetail(row);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && !disabled && !editDisabled) {
      onEdit(row);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && !disabled && !deleteDisabled) {
      onDelete(row.id || row);
    }
  };

  // Ikon default jika tidak ada ikon kustom yang diberikan
  const DefaultViewIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
  );

  const DefaultEditIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
    </svg>
  );

  const DefaultDeleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path
        fillRule="evenodd"
        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
      />
    </svg>
  );

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Ikon Detail */}
      {showDetail && (
        <IconButton
          icon={detailIcon || <DefaultViewIcon />}
          color="blue"
          onClick={handleDetail}
          title={detailTitle}
          disabled={disabled || detailDisabled}
        />
      )}

      {/* Ikon Edit */}
      {showEdit && (
        <IconButton
          icon={editIcon || <DefaultEditIcon />}
          color="green"
          onClick={handleEdit}
          title={editTitle}
          disabled={disabled || editDisabled}
        />
      )}

      {/* Ikon Hapus */}
      {showDelete && (
        <IconButton
          icon={deleteIcon || <DefaultDeleteIcon />}
          color="red"
          onClick={handleDelete}
          title={deleteTitle}
          disabled={disabled || deleteDisabled}
        />
      )}
    </div>
  );
};

export default TableActionsIcon;
