import axios from "axios";
import InputForm from "../../../../components/Elements/Input";
import Loading from "../../../../components/Elements/Loading";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import SelectForm from "../../../../components/Elements/Select";

const EditServiceCostModal = ({ isOpen, onClose, service_cost_id }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    service_id: "",
    cost_component_id: "",
    unit: "",
    unit_price: "",
    quantity: "",
    conversion_qty: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      if (!service_cost_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/service-cost/${service_cost_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const productCostData = response.data.data;

          setFormData({
            id: productCostData.id,
            service_id: productCostData.service_id,
            cost_component_id: productCostData.cost_component_id,
            unit: productCostData.unit,
            unit_price: productCostData.unit_price,
            quantity: productCostData.quantity,
            conversion_qty: productCostData.conversion_qty,
            amount: productCostData.amount,
          });
        }
      } catch (error) {
        console.error("Error fetching:", error);
        showAlert("error", "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && service_cost_id) {
      fetchExpense();
    }
  }, [token, service_cost_id, isOpen, showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/service-cost/${service_cost_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        showAlert("Komponen berhasil diperbarui", "success");
        onClose();
      } else {
        showAlert(
          response.data?.message || "Gagal memperbarui Komponen",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating category:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        showAlert(
          "error",
          error.response?.data?.message || "Gagal memperbarui Komponen"
        );
      }
    } finally {
      setSubmitting(false);
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
  const unitOptions = [
    { value: "", label: "Pilih Satuan" },
    { value: "meter", label: "meter" },
    { value: "cm", label: "cm" },
    { value: "pcs", label: "pcs" },
    { value: "set", label: "set" },
    { value: "ml", label: "ml" },
    { value: "gram", label: "gram" },
    { value: "kg", label: "kg" },
  ];

  return (
    <ModalForm
      id="modal-edit-category"
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Komponen"
      size="medium"
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <SelectForm
            label="Satuan Kebutuhan"
            ariaLabel="Unit"
            name="unit"
            type="text"
            value={formData.unit}
            options={unitOptions}
            onChange={handleChange}
            error={errors.unit}
            disabled={false}
            helperText="Satuan kebutuhan untuk 1 layanan jadi"
          />

          <InputForm
            label="Harga (Beli)"
            name="unit_price"
            type="number"
            placeholder="2990000"
            value={formData.unit_price}
            onChange={handleChange}
            error={errors.unit_price}
            required
          />
          <InputForm
            label="Kuantitas Pembelian"
            name="conversion_qty"
            type="number"
            placeholder="1"
            value={formData.conversion_qty}
            onChange={handleChange}
            error={errors.conversion_qty}
            helperText="Jumlah beli barang yang dikonversi dalam satuan beli"
            required
          />
          <InputForm
            label="Kuantitas Kebutuhan"
            name="quantity"
            type="number"
            placeholder="1"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            helperText="Kuantitas kebutuhan untuk 1 layanan jadi"
            required
          />
        </>
      )}
    </ModalForm>
  );
};
export default EditServiceCostModal;
