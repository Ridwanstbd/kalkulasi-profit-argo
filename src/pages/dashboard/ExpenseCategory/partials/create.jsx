import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import ModalForm from "../../../../components/Fragments/ModalForm";
import InputForm from "../../../../components/Elements/Input";
import Checkbox from "../../../../components/Elements/Checkbox";

const CreateCategory = ({ isOpen, onClose }) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: user?.id,
    name: "",
    description: "",
    is_salary: false,
  });
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }
      const dataToSubmit = { ...formData, user_id: user.id };
      await axios.post(`${apiBaseUrl}/api/expense-categories`, dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      showAlert("Kategori berhasil disimpan!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${error.response.data.message || "Gagal menyimpan produk"}`,
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
    <>
      <ModalForm
        id="modal-add-category"
        title="Tambah Kategori Baru"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateCategory}
        size="medium"
      >
        <InputForm
          label="Nama Kategori"
          name="name"
          type="text"
          placeholder="Gaji Manager"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <InputForm
          label="Deskripsi Kategori"
          name="description"
          type="textarea"
          placeholder="(opsional)"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />
        <Checkbox
          name="is_salary"
          onChange={handleChange}
          checked={formData.is_salary}
          label="Bagian Biaya Gaji"
        />
      </ModalForm>
    </>
  );
};
export default CreateCategory;
