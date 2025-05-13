import axios from "axios";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Select2Form from "../../../../components/Elements/Select2";
import InputForm from "../../../../components/Elements/Input";
import SelectForm from "../../../../components/Elements/Select";

const CreateSales = ({ isOpen, onClose }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();
  const [productLoading, setProductLoading] = useState({
    product: false,
  });
  const [errors, setErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [options, setOptions] = useState({
    product: [],
  });
  const [formData, setFormData] = useState({});

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const handleCreateSales = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }
      if (!formData.product_id) {
        setErrors((prev) => ({ ...prev, product: "Produk harus dipilih!" }));
        return;
      }

      await axios.post(`${apiBaseUrl}/v1/sales`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showAlert("Rekap berhasil disimpan!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${error.response.data.message || "Gagal menyimpan "}`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    }
  };

  const generateYearOptions = () => {
    const years = [];
    years.push({ value: "", label: "Pilih Tahun" });

    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push({ value: i.toString(), label: i.toString() });
    }

    return years;
  };

  const getMonthOptions = () => {
    const baseMonthOptions = [
      { value: "", label: "Pilih Bulan" },
      { value: "1", label: "Januari" },
      { value: "2", label: "Februari" },
      { value: "3", label: "Maret" },
      { value: "4", label: "April" },
      { value: "5", label: "Mei" },
      { value: "6", label: "Juni" },
      { value: "7", label: "Juli" },
      { value: "8", label: "Agustus" },
      { value: "9", label: "September" },
      { value: "10", label: "Oktober" },
      { value: "11", label: "November" },
      { value: "12", label: "Desember" },
    ];

    if (formData.year === currentYear.toString()) {
      return baseMonthOptions.filter(
        (month) => month.value === "" || parseInt(month.value) <= currentMonth
      );
    }

    return baseMonthOptions;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductLoading((prev) => ({ ...prev, product: true }));

        const response = await axios.get(`${apiBaseUrl}/v1/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.data.data;

        const formattedData = data.map((product) => ({
          value: product.id,
          label: product.name,
        }));

        setOptions((prev) => ({ ...prev, product: formattedData }));
      } catch (error) {
        console.error("Error fetching products:", error);
        showAlert("Gagal mengambil data kategori", "error");
      } finally {
        setProductLoading((prev) => ({ ...prev, product: false }));
      }
    };
    if (token) {
      fetchProduct();
    }
  }, [token, showAlert, setProductLoading]);

  useEffect(() => {
    if (
      formData.year === currentYear.toString() &&
      parseInt(formData.month) > currentMonth
    ) {
      setFormData((prev) => ({
        ...prev,
        month: "",
      }));
    }
  }, [formData.year, currentMonth, currentYear, formData.month]);

  const handleProductChange = (value) => {
    setSelectedProduct(value);
    if (value && value.length > 0) {
      setFormData((prev) => ({
        ...prev,
        product_id: value[0].value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        product_id: "",
      }));
    }
    if (errors.product || errors.product_id) {
      setErrors((prev) => ({
        ...prev,
        product: undefined,
      }));
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
      id="modal-create-expense"
      title="Tambah Rekap Penjualan"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleCreateSales}
      size="medium"
    >
      <Select2Form
        label="Produk"
        name="product_id"
        placeholder="Pilih Produk..."
        searchPlaceholder="Cari Produk..."
        options={options.product}
        value={selectedProduct}
        onChange={handleProductChange}
        error={errors.product || errors.product_id}
        isLoading={productLoading.product}
        required
      />

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
      <SelectForm
        label="Tahun"
        ariaLabel="Tahun"
        name="year"
        value={formData.year}
        options={generateYearOptions()}
        onChange={handleChange}
        error={errors.year}
        required
      />
      <SelectForm
        label="Bulan"
        ariaLabel="Bulan"
        name="month"
        value={formData.month}
        options={getMonthOptions()}
        onChange={handleChange}
        error={errors.month}
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
        required
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
        required
      />
    </ModalForm>
  );
};
export default CreateSales;
