import { useOutletContext } from "react-router-dom";
import ModalForm from "../../../../components/Fragments/ModalForm";
import InputForm from "../../../../components/Elements/Input";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";
import { apiBaseUrl } from "../../../../config/api";
import { useState } from "react";

const CreateServiceModal = ({ isOpen, onClose }) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: user?.id,
    name: "",
    sku: "",
    description: "",
  });

  const handleCreateService = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }
      const dataToSubmit = { ...formData, user_id: user.id };
      await axios.post(`${apiBaseUrl}/api/services`, dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      showAlert("Layanan berhasil disimpan!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${error.response.data.message || "Gagal menyimpan layanan"}`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  return (
    <ModalForm
      id="modal-add-service"
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Layanan Baru"
      size="medium"
      onSubmit={handleCreateService}
    >
      <InputForm
        label="Nama layanan"
        name="name"
        type="text"
        placeholder="Dress A"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <InputForm
        label="Kode layanan"
        name="sku"
        type="text"
        placeholder="A0001"
        value={formData.sku}
        onChange={handleChange}
        error={errors.sku}
        required
      />
      <InputForm
        label="Deskripsi layanan"
        name="description"
        type="textarea"
        placeholder="(opsional)"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />
    </ModalForm>
  );
};
export default CreateServiceModal;
