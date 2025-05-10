import React, { useState, useRef, useEffect } from "react";

const TableActionsDropdown = ({
  row,
  onDetail,
  onEdit,
  onDelete,
  showDetail = true,
  showEdit = true,
  showDelete = true,
  detailLabel = "Lihat Detail",
  editLabel = "Edit Data",
  deleteLabel = "Hapus Data",
  detailIcon = null,
  editIcon = null,
  deleteIcon = null,
  buttonLabel = "Aksi",
  className = "",
  disabled = false,
  detailDisabled = false,
  editDisabled = false,
  deleteDisabled = false,
  additionalActions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropPosition, setDropPosition] = useState("bottom");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Cek posisi dropdown apakah perlu di-adjust
  const checkPosition = () => {
    if (!menuRef.current || !buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Jika menu akan keluar dari viewport di bagian bawah
    if (buttonRect.bottom + menuHeight > viewportHeight) {
      setDropPosition("top");
    } else {
      setDropPosition("bottom");
    }
  };

  // Tutup dropdown ketika klik di luar
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

  // Toggle dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!disabled) {
      // Cek posisi hanya saat dropdown dibuka
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);

      // Jika dropdown dibuka, cek posisi pada render berikutnya
      if (newIsOpen) {
        setTimeout(checkPosition, 0);
      }
    }
  };

  // Handler untuk aksi
  const handleDetail = (e) => {
    e.stopPropagation();
    if (onDetail && !detailDisabled) {
      onDetail(row);
      setIsOpen(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && !editDisabled) {
      onEdit(row);
      setIsOpen(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && !deleteDisabled) {
      onDelete(row.id || row);
      setIsOpen(false);
    }
  };

  // Handler untuk aksi tambahan
  const handleAdditionalAction = (e, action) => {
    e.stopPropagation();
    if (action.onClick && !action.disabled) {
      action.onClick(row);
      setIsOpen(false);
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

  // Class untuk disable state
  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  // Style posisi untuk dropdown menu
  const dropdownPositionStyle = {
    top: dropPosition === "top" ? "auto" : "100%",
    bottom: dropPosition === "top" ? "100%" : "auto",
    right: 0,
    marginTop: dropPosition === "top" ? "0" : "0.5rem",
    marginBottom: dropPosition === "top" ? "0.5rem" : "0",
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 ${disabledClass}`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        {buttonLabel}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-10 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={dropdownPositionStyle}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {/* Opsi Detail */}
            {showDetail && (
              <button
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  detailDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
                onClick={handleDetail}
                disabled={detailDisabled}
                role="menuitem"
              >
                <span className="mr-2">
                  {detailIcon || <DefaultViewIcon />}
                </span>
                {detailLabel}
              </button>
            )}

            {/* Opsi Edit */}
            {showEdit && (
              <button
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  editDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 hover:bg-green-50"
                }`}
                onClick={handleEdit}
                disabled={editDisabled}
                role="menuitem"
              >
                <span className="mr-2">{editIcon || <DefaultEditIcon />}</span>
                {editLabel}
              </button>
            )}

            {/* Opsi Hapus */}
            {showDelete && (
              <button
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  deleteDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-600 hover:bg-red-50"
                }`}
                onClick={handleDelete}
                disabled={deleteDisabled}
                role="menuitem"
              >
                <span className="mr-2">
                  {deleteIcon || <DefaultDeleteIcon />}
                </span>
                {deleteLabel}
              </button>
            )}

            {/* Aksi tambahan jika ada */}
            {additionalActions.map((action, index) => (
              <button
                key={index}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  action.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : `text-${action.color || "gray"}-600 hover:bg-${
                        action.color || "gray"
                      }-50`
                }`}
                onClick={(e) => handleAdditionalAction(e, action)}
                disabled={action.disabled}
                role="menuitem"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableActionsDropdown;
