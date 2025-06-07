import { useOutletContext } from "react-router-dom";
import ModalDelete from "../../../../components/Fragments/ModalDelete";
import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";

const DeleteSalesModal = ({ isOpen, onClose, sales_id, onDeleted }) => {
  const { showAlert } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!sales_id) return;
    try {
      setIsLoading(true);

      await axios.delete(`${apiBaseUrl}/api/sales/${sales_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (typeof onDeleted === "function") {
        onDeleted(sales_id);
      }
      onClose();
    } catch (error) {
      console.error("Error Delete:", error);
      showAlert(
        `Gagal menghapus : ${error.response?.data?.message || error.message}`,
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
      title="Hapus Rekap"
      message="Apakah kamu yakin ingin menghapus rekap ini?"
      deleteButtonText="Hapus"
      cancelButtonText="Batalkan"
      size="small"
      isLoading={isLoading}
    />
  );
};
export default DeleteSalesModal;
