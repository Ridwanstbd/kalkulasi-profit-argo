import React, { useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import Loading from "../../../../components/Elements/Loading";
import InputForm from "../../../../components/Elements/Input";
import { useOutletContext } from "react-router-dom";
import ModalForm from "../../../../components/Fragments/ModalForm";

const EditProductModal = ({
  isOpen,
  onClose,
  product_id,
  onProductUpdated,
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
    const fetchProduct = async () => {
      if (!product_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/v1/products/${product_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const productData = response.data.data;
          // Initialize form data with the product data
          setFormData({
            user_id: user?.id,
            name: productData.name || "",
            sku: productData.sku || "",
            description: productData.description || "",
            hpp: productData.hpp || "",
            selling_price: productData.selling_price || "",
          });
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        showAlert("Gagal mengambil data produk", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && product_id) {
      fetchProduct();
    }
  }, [token, product_id, isOpen, user?.id, showAlert]);

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
      newErrors.name = "Nama produk tidak boleh kosong";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU produk tidak boleh kosong";
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
        `${apiBaseUrl}/v1/products/${product_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        showAlert("Produk berhasil diperbarui", "success");
        if (typeof onProductUpdated === "function") {
          onProductUpdated();
        }
        onClose();
      } else {
        showAlert(
          response.data?.message || "Gagal memperbarui produk",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors from the backend
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        showAlert(
          error.response?.data?.message || "Gagal memperbarui produk",
          "error"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalForm
      id="modal-edit-product"
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Produk"
      size="large"
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label="Nama Produk"
            name="name"
            type="text"
            placeholder="Masukkan nama produk"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <InputForm
            label="Stock Keeping Unit Produk"
            name="sku"
            type="text"
            placeholder="Masukkan SKU produk"
            value={formData.sku}
            onChange={handleChange}
            error={errors.sku}
            required
          />
          <InputForm
            label="Harga Pokok Produk"
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
            label="Harga Jual Produk"
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
              label="Deskripsi Produk"
              name="description"
              type="textarea"
              placeholder="Tuliskan deskripsi produk disini..."
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

export default EditProductModal;
