import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";
import InputForm from "../../../../components/Elements/Input";
import SelectForm from "../../../../components/Elements/Select";
import ModalForm from "../../../../components/Fragments/ModalForm";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";

const CreateComponent = ({ isOpen, onClose }) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: user?.id,
    name: "",
    description: "",
    component_type: "",
  });
  const handleCreateComponent = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }
      const dataToSubmit = { ...formData, user_id: user.id };
      await axios.post(`${apiBaseUrl}/api/cost-components`, dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      showAlert("Produk berhasil disimpan!", "success");
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
  const componentTypeOptions = [
    { value: "", label: "Pilih Bahan Baku" },
    { value: "direct_material", label: "Bahan Baku Langsung" },
    { value: "indirect_material", label: "Bahan Baku Tidak Langsung" },
    { value: "direct_labor", label: "Tenaga Kerja Langsung" },
    { value: "overhead", label: "Overhead" },
    { value: "packaging", label: "Pengemasan" },
    { value: "other", label: "Lainnya" },
  ];

  return (
    <>
      <ModalForm
        id="modal-add-component"
        title="Tambah Komponen Baru"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateComponent}
        size="medium"
      >
        <InputForm
          label="Nama Komponen"
          name="name"
          type="text"
          placeholder="Kain"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <InputForm
          label="Deskripsi Komponen"
          name="description"
          type="textarea"
          placeholder="(opsional)"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />
        <SelectForm
          label="Tipe Komponen"
          name="component_type"
          value={formData.component_type}
          onChange={handleChange}
          options={componentTypeOptions}
          ariaLabel="Tipe Komponen"
          className="w-full"
          disabled={false}
        />
      </ModalForm>
    </>
  );
};
export default CreateComponent;
