import axios from "axios";
import InputForm from "../../../../components/Elements/Input";
import Loading from "../../../../components/Elements/Loading";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Checkbox from "../../../../components/Elements/Checkbox";

const EditPricingModal = ({ isOpen, onClose, price_id, product_name }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: false,
    level_name: "",
    level_order: "",
    purchase_price: "",
    selling_price: "",
    discount_percentage: "",
    notes: "",
  });

  useEffect(() => {
    const fetchScheme = async () => {
      if (!price_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/price-schemes/${price_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const schemeData = response.data.data;
          setFormData({
            type: schemeData.selling_price ? true : false,
            level_name: schemeData.level_name || "",
            level_order: schemeData.level_order || "",
            purchase_price: schemeData.purchase_price || "",
            selling_price: schemeData.selling_price || "",
            discount_percentage: schemeData.discount_percentage || "",
            notes: schemeData.notes || "",
          });
        }
      } catch (error) {
        console.error("Error fetching:", error);
        showAlert("Gagal mengambil data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && price_id) {
      fetchScheme();
    }
  }, [token, price_id, isOpen, showAlert]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.level_name) {
      newErrors.level_name = "Level distribusi tidak boleh kosong";
    }

    if (
      formData.type &&
      Number(formData.selling_price) <= Number(formData.purchase_price)
    ) {
      newErrors.selling_price = "Harga jual harus lebih besar dari harga beli";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const dataToSubmit = { ...formData };

      if (!formData.type) {
        delete dataToSubmit.selling_price;
      } else {
        delete dataToSubmit.discount_percentage;
      }

      await axios.put(
        `${apiBaseUrl}/api/price-schemes/${price_id}`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert("Skema harga berhasil diperbarui", "success");
      onClose();
    } catch (error) {
      console.error("Error updating price scheme:", error);

      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${
            error.response.data.message || "Gagal memperbarui skema harga"
          }`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalForm
      id="modal-edit-scheme"
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Skema Harga: ${product_name || "Produk"}`}
      size="large"
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
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
            label="Centang Kotak Jika ingin Harga Jual Langsung"
            className="my-2"
          />
          <InputForm
            label="Harga Beli"
            name="purchase_price"
            type="number"
            placeholder="Masukkan harga beli"
            value={formData.purchase_price || ""}
            onChange={handleChange}
            error={errors.purchase_price}
            required
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
        </>
      )}
    </ModalForm>
  );
};

export default EditPricingModal;
