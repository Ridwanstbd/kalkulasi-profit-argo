import axios from "axios";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import InputForm from "../../../../components/Elements/Input";
import Loading from "../../../../components/Elements/Loading";

const EditSalesModal = ({ isOpen, onClose, sales_id }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState({});
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    product_id: "",
    number_of_sales: "",
    year: "",
    month: "",
    hpp: "",
    selling_price: "",
  });

  const handleEditSalesModal = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }

      await axios.put(
        `${apiBaseUrl}/v1/sales/${sales_id}`,
        {
          number_of_sales: formData.number_of_sales,
          hpp: formData.hpp,
          selling_price: formData.selling_price,
          product_id: salesData.product_id,
          year: salesData.year,
          month: salesData.month,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert("Jumlah penjualan berhasil diperbarui!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${error.response.data.message || "Gagal menyimpan"}`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    }
  };

  useEffect(() => {
    const fetchSales = async () => {
      if (!sales_id) return;
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/v1/sales/${sales_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.data) {
          const data = response.data.data;
          setSalesData(data);

          setFormData({
            number_of_sales: data.number_of_sales,
            hpp: data.hpp,
            selling_price: data.selling_price,
          });
        }
      } catch (error) {
        console.error("Error fetching sales details:", error);
        showAlert("Gagal mengambil data penjualan", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && sales_id) {
      fetchSales();
    }
  }, [token, showAlert, isOpen, sales_id]);

  // Reset form ketika modal dibuka/ditutup
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        number_of_sales: "",
      });
      setErrors({});
    }
  }, [isOpen]);

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
      id="modal-edit-sales"
      title="Edit Jumlah Penjualan"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleEditSalesModal}
      size="small"
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <InputForm
            label="Terjual"
            name="number_of_sales"
            type="number"
            placeholder="100"
            value={formData.number_of_sales}
            onChange={handleChange}
            error={errors.number_of_sales}
            helperText="Jumlah Satuan Produk per bulan yang terjual"
            required
          />
          <InputForm
            label="HPP Terjual"
            name="hpp"
            type="number"
            placeholder="100"
            value={formData.hpp}
            onChange={handleChange}
            error={errors.hpp}
            helperText="Harga Pokok Produk per unit yang terjual"
          />
          <InputForm
            label="Harga Terjual"
            name="selling_price"
            type="number"
            placeholder="100"
            value={formData.selling_price}
            onChange={handleChange}
            error={errors.selling_price}
            helperText="Harga Jual Produk per unit yang terjual"
          />
        </>
      )}
    </ModalForm>
  );
};
export default EditSalesModal;
