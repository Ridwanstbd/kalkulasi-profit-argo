import { useState } from "react";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";
import ModalDelete from "../../../../components/Fragments/ModalDelete";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const DeleteServiceModal = ({
  isOpen,
  onClose,
  service_id,
  onServiceDeleted,
}) => {
  const { showAlert } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!service_id) return;

    try {
      setIsLoading(true);

      await axios.delete(`${apiBaseUrl}/api/services/${service_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (typeof onServiceDeleted === "function") {
        onServiceDeleted(service_id);
      }

      onClose();
    } catch (error) {
      console.error("Error Menghapus Layanan:", error);
      showAlert(
        `Gagal menghapus layanan: ${
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
      title="Hapus layanan"
      message="Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan."
      deleteButtonText="Hapus"
      cancelButtonText="Batalkan"
      size="small"
      isLoading={isLoading}
    />
  );
};

export default DeleteServiceModal;
