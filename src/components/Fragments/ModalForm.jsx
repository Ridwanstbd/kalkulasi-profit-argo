import React from "react";
import Modal from "../Fragments/Modal";

const ModalForm = ({
  id,
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  submitting = false,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  size = "large",
}) => {
  return (
    <Modal id={id} title={title} isOpen={isOpen} onClose={onClose} size={size}>
      <form onSubmit={onSubmit}>
        {children}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {submitting ? "Menyimpan..." : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalForm;
