import axios from "axios";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";
import InputForm from "../../../../components/Elements/Input";
import Checkbox from "../../../../components/Elements/Checkbox";

const CreatePricingModal = ({ isOpen, onClose, service_id, service_name }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ type: false });

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

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }
      if (
        formData.type &&
        Number(formData.selling_price) <= Number(formData.purchase_price)
      ) {
        setErrors({
          ...errors,
          selling_price: "Harga jual harus lebih besar dari harga beli",
        });
        return;
      }

      const dataToSubmit = { ...formData, service_id };

      await axios.post(`${apiBaseUrl}/api/price-schemes`, dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showAlert("Scheme berhasil disimpan!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${
            error.response.data.message || "Gagal menyimpan biaya produksi"
          }`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    }
  };

  return (
    <ModalForm
      id="modal-create-scheme"
      title={`Tambah Skema Harga: ${service_name || "Layanan"}`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleCreateScheme}
      size="large"
    >
      {errors.costs && typeof errors.costs === "string" && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.costs}
        </div>
      )}
      <InputForm
        label="Level Distribusi"
        name="level_name"
        type="text"
        placeholder="Produsen"
        value={formData.level_name || ""}
        onChange={handleChange}
        error={errors.level_name}
        required
      />
      <Checkbox
        name="type"
        onChange={handleChange}
        checked={formData.type}
        label="Centang Kotak Jika ingin Harga Jual Langsung."
        className="my-2"
      />
      {formData.type ? (
        <InputForm
          label="Harga Jual (Langsung)"
          name="selling_price"
          type="number"
          placeholder="Masukkan harga jual"
          value={formData.selling_price || ""}
          onChange={handleChange}
          error={errors.selling_price}
          required
        />
      ) : (
        <InputForm
          label="Persentase Margin (%)"
          name="discount_percentage"
          type="number"
          placeholder="Masukkan persentase margin"
          value={formData.discount_percentage || ""}
          onChange={handleChange}
          error={errors.discount_percentage}
          required
        />
      )}
      <InputForm
        label="Catatan"
        name="notes"
        type="textarea"
        placeholder="(opsional)"
        value={formData.notes || ""}
        onChange={handleChange}
        error={errors.notes}
      />
    </ModalForm>
  );
};

export default CreatePricingModal;
