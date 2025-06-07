import { useOutletContext } from "react-router-dom";
import ModalDelete from "../../../../components/Fragments/ModalDelete";
import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";

const DeletePricingModal = ({ isOpen, onClose, price_id, onDeleted }) => {
  const { showAlert } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!price_id) return;
    try {
      setIsLoading(true);

      await axios.delete(`${apiBaseUrl}/api/price-schemes/${price_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (typeof onDeleted === "function") {
        onDeleted(price_id);
      }
      onClose();
    } catch (error) {
      console.error("Error Deleting:", error);
      showAlert(
        `Gagal menghapus: ${error.response?.data?.message || error.message}`,
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
      title="Hapus Skema"
      message="Apakah kamu yakin ingin menghapus  ini?"
      deleteButtonText="Hapus"
      cancelButtonText="Batalkan"
      size="small"
      isLoading={isLoading}
    />
  );
};
export default DeletePricingModal;
