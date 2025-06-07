import axios from "axios";
import InputForm from "../../../../components/Elements/Input";
import Loading from "../../../../components/Elements/Loading";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import SelectForm from "../../../../components/Elements/Select";

const EditExpenseModal = ({ isOpen, onClose, expense_id }) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [formData, setFormData] = useState({
    user_id: user?.id,
    expense_category_id: "",
    quantity: "",
    unit: "",
    amount: "",
    year: "",
    month: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      if (!expense_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/operational-expenses/${expense_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const expenseData = response.data.data;

          setFormData({
            user_id: user?.id,
            expense_category_id: expenseData.category.id,
            quantity: expenseData.quantity,
            unit: expenseData.unit,
            amount: expenseData.amount,
            year: expenseData.year,
            month: expenseData.month,
          });

          setSelectedCategory([
            {
              value: expenseData.category.id,
              label: expenseData.category.name,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching:", error);
        showAlert("error", "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && expense_id) {
      fetchExpense();
    }
  }, [token, expense_id, isOpen, user?.id, showAlert]);

  const options =
    selectedCategory.length > 0
      ? selectedCategory
      : [{ value: "", label: "Pilih Kategori" }];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.expense_category_id) {
      newErrors.expense_category_id = "Kategori tidak boleh kosong";
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
        `${apiBaseUrl}/api/operational-expenses/${expense_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        showAlert("Kategori berhasil diperbarui", "success");
        onClose();
      } else {
        showAlert(
          response.data?.message || "Gagal memperbarui Kategori",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating category:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors from the backend
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        showAlert(
          "error",
          error.response?.data?.message || "Gagal memperbarui kategori"
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
    { value: "", label: "Pilih Unit" },
    { value: "orang", label: "Orang" },
    { value: "minggu", label: "Minggu" },
    { value: "set", label: "Set" },
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

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
  return (
    <ModalForm
      id="modal-edit-category"
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Kategori"
      size="medium"
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <SelectForm
            label="Kategori"
            name="expense_category_id"
            placeholder="Pilih Kategori..."
            searchPlaceholder="Cari kategori..."
            options={options}
            value={selectedCategory}
            error={errors.expense_category_id}
            disabled={true}
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
        </>
      )}
    </ModalForm>
  );
};
export default EditExpenseModal;
