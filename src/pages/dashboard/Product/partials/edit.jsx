import React, { useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import Loading from "../../../../components/Elements/Loading";
import InputForm from "../../../../components/Elements/Input";
import { useOutletContext } from "react-router-dom";
import ModalForm from "../../../../components/Fragments/ModalForm";

const EditServiceModal = ({
  isOpen,
  onClose,
  service_id,
  onServiceUpdated,
}) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: user?.id,
    name: "",
    sku: "",
    description: "",
    hpp: "",
    selling_price: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!service_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/services/${service_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const serviceData = response.data.data;
          setFormData({
            user_id: user?.id,
            name: serviceData.name || "",
            sku: serviceData.sku || "",
            description: serviceData.description || "",
            hpp: serviceData.hpp || "",
            selling_price: serviceData.selling_price || "",
          });
        }
      } catch (error) {
        console.error("Error fetching Service details:", error);
        showAlert("Gagal mengambil data Layanan", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && service_id) {
      fetchService();
    }
  }, [token, service_id, isOpen, user?.id, showAlert]);

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

    if (!formData.name.trim()) {
      newErrors.name = "Nama Layanan tidak boleh kosong";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU Layanan tidak boleh kosong";
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
      const response = await axios.put(
        `${apiBaseUrl}/api/Services/${service_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        showAlert("Layanan berhasil diperbarui", "success");
        if (typeof onServiceUpdated === "function") {
          onServiceUpdated();
        }
        onClose();
      } else {
        showAlert(
          response.data?.message || "Gagal memperbarui Layanan",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating Service:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors from the backend
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        showAlert(
          error.response?.data?.message || "Gagal memperbarui Layanan",
          "error"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalForm
      id="modal-edit-Service"
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Layanan"
      size="large"
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label="Nama Layanan"
            name="name"
            type="text"
            placeholder="Masukkan nama Layanan"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <InputForm
            label="Kode Layanan"
            name="sku"
            type="text"
            placeholder="Masukkan Kode Layanan"
            value={formData.sku}
            onChange={handleChange}
            error={errors.sku}
            required
          />
          <InputForm
            label="Harga Pokok Layanan"
            name="hpp"
            type="number"
            placeholder="0"
            value={formData.hpp}
            onChange={handleChange}
            error={errors.hpp}
            readOnly
            helperText="HPP dihitung otomatis pada Menu Kalkulasi HPP"
          />
          <InputForm
            label="Harga Jual Layanan"
            name="selling_price"
            type="number"
            placeholder="0"
            value={formData.selling_price}
            onChange={handleChange}
            error={errors.selling_price}
            readOnly
            helperText="Harga jual dihitung otomatis pada Menu Skema Harga Retail"
          />
          <div className="md:col-span-2">
            <InputForm
              label="Deskripsi Layanan"
              name="description"
              type="textarea"
              placeholder="Tuliskan deskripsi Layanan disini..."
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
            />
          </div>
        </div>
      )}
    </ModalForm>
  );
};

export default EditServiceModal;
