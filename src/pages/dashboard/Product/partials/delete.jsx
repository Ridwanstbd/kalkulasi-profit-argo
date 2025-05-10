import { useState } from "react";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";
import ModalDelete from "../../../../components/Fragments/ModalDelete";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const DeleteProductModal = ({
  isOpen,
  onClose,
  product_id,
  onProductDeleted,
}) => {
  const { showAlert } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!product_id) return;

    try {
      setIsLoading(true);

      await axios.delete(`${apiBaseUrl}/v1/products/${product_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (typeof onProductDeleted === "function") {
        onProductDeleted(product_id);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      showAlert(
        `Gagal menghapus produk: ${
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
      title="Hapus Produk"
      message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
      deleteButtonText="Hapus"
      cancelButtonText="Batalkan"
      size="small"
      isLoading={isLoading}
    />
  );
};

export default DeleteProductModal;
