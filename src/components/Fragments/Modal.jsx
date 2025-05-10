const sizeClasses = {
  small: "max-w-sm",
  medium: "max-w-md",
  large: "max-w-3xl",
};

const Modal = ({ isOpen, onClose, title, children, size = "medium", id }) => {
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
          >
            ✕
          </button>
          {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
          <div className="overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
