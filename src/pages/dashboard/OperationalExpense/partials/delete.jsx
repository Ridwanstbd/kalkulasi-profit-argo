import { useOutletContext } from "react-router-dom";
import ModalDelete from "../../../../components/Fragments/ModalDelete";
import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";

const DeleteExpenseModal = ({ isOpen, onClose, expense_id, onDeleted }) => {
  const { showAlert } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!expense_id) return;
    try {
      setIsLoading(true);

      await axios.delete(
        `${apiBaseUrl}/api/operational-expenses/${expense_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (typeof onDeleted === "function") {
        onDeleted(expense_id);
      }
      onClose();
    } catch (error) {
      console.error("Error Deleting category:", error);
      showAlert(
        `Gagal menghapus kategori: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      onDelete={handleDelete}
      title="Hapus Kategori"
      message="Apakah kamu yakin ingin menghapus kategori ini?"
      deleteButtonText="Hapus"
      cancelButtonText="Batalkan"
      size="small"
      isLoading={isLoading}
    />
  );
};
export default DeleteExpenseModal;
