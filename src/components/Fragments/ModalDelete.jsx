const sizeClasses = {
  small: "max-w-sm",
  medium: "max-w-md",
  large: "max-w-3xl",
};

const ModalDelete = ({
  isOpen,
  onClose,
  onDelete,
  title = "Konfirmasi",
  message = "Kamu yakin?",
  deleteButtonText = "Hapus",
  cancelButtonText = "Batalkan",
  size = "small",
  id,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        id={id}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div
          className={`bg-white rounded-2xl shadow-lg w-full ${sizeClasses[size]} p-6 relative mx-4 max-h-[90vh] flex flex-col`}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            disabled={isLoading}
          >
            ✕
          </button>
          {title && <h2 className="text-2xl font-semibold mb-2">{title}</h2>}
          <div className="overflow-y-auto flex-1 mb-6">
            <p className="text-gray-600">{message}</p>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              disabled={isLoading}
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                deleteButtonText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDelete;
