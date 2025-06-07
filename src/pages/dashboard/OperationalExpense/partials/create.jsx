import axios from "axios";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Select2Form from "../../../../components/Elements/Select2";
import InputForm from "../../../../components/Elements/Input";
import SelectForm from "../../../../components/Elements/Select";

const CreateExpense = ({ isOpen, onClose }) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [categoryLoading, setCategoryLoading] = useState({
    category: false,
  });
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [options, setOptions] = useState({
    category: [],
  });
  const [formData, setFormData] = useState({
    expense_category_id: "",
    quantity: "",
    unit: "",
    amount: "",
    year: "",
    month: "",
  });

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }
      if (!formData.expense_category_id) {
        setErrors((prev) => ({ ...prev, category: "Kategori harus dipilih!" }));
        return;
      }

      const dataToSubmit = { ...formData, user_id: user.id };
      await axios.post(`${apiBaseUrl}/api/operational-expenses`, dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showAlert("Biaya berhasil disimpan!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${
            error.response.data.message || "Gagal menyimpan biaya operasional"
          }`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    }
  };

  const unitOptions = [
    { value: "", label: "Pilih Unit" },
    { value: "orang", label: "Orang" },
    { value: "minggu", label: "Minggu" },
    { value: "set", label: "Set" },
  ];

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
    const fetchCategory = async () => {
      try {
        setCategoryLoading((prev) => ({ ...prev, category: true }));

        const response = await axios.get(
          `${apiBaseUrl}/api/expense-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.data.data;

        const formattedData = data.map((category) => ({
          value: category.id,
          label: category.name,
        }));

        setOptions((prev) => ({ ...prev, category: formattedData }));
      } catch (error) {
        console.error("Error fetching categorys:", error);
        showAlert("Gagal mengambil data kategori", "error");
      } finally {
        setCategoryLoading((prev) => ({ ...prev, category: false }));
      }
    };
    if (token) {
      fetchCategory();
    }
  }, [token, showAlert, setCategoryLoading]);

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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    if (value && value.length > 0) {
      setFormData((prev) => ({
        ...prev,
        expense_category_id: value[0].value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        expense_category_id: "",
      }));
    }
    if (errors.category || errors.expense_category_id) {
      setErrors((prev) => ({
        ...prev,
        category: undefined,
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
      title="Tambah Biaya Operasional"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleCreateExpense}
      size="medium"
    >
      <Select2Form
        label="Kategori"
        name="expense_category_id"
        placeholder="Pilih Kategori..."
        searchPlaceholder="Cari kategori..."
        options={options.category}
        value={selectedCategory}
        onChange={handleCategoryChange}
        error={errors.category || errors.expense_category_id}
        isLoading={categoryLoading.category}
        required
      />
      <InputForm
        label="Kuantitas"
        name="quantity"
        type="numeric"
        placeholder="1"
        value={formData.quantity}
        onChange={handleChange}
        error={errors.quantity}
        required
      />
      <SelectForm
        label="Satuan"
        ariaLabel="Unit"
        name="unit"
        value={formData.unit}
        options={unitOptions}
        onChange={handleChange}
        error={errors.unit}
        disabled={false}
      />
      <InputForm
        label="Jumlah Biaya per unit (Rp) "
        name="amount"
        type="number"
        placeholder="100000"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
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
    </ModalForm>
  );
};
export default CreateExpense;
