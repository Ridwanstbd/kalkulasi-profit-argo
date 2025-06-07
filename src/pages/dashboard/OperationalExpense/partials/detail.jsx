import axios from "axios";
import Loading from "../../../../components/Elements/Loading";
import Modal from "../../../../components/Fragments/Modal";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import InputForm from "../../../../components/Elements/Input";
import SelectForm from "../../../../components/Elements/Select";

const DetailExpenseModal = ({ isOpen, onClose, expense_id }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState({});
  const [categoryData, setCategoryData] = useState({});

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
          setExpenseData(response.data.data);
        }
        if (response.data && response.data.data.category) {
          setCategoryData(response.data.data.category);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && expense_id) {
      fetchExpense();
    }
  }, [token, expense_id, isOpen]);

  const handleNoOpChange = () => {};

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

    return baseMonthOptions;
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Modal
      id="modal-detail-category"
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Kategori"
      size="medium"
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <InputForm
            label="Nama Kategori"
            name="name"
            type="text"
            placeholder="Gaji Manager"
            value={categoryData.name}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Jumlah"
            name="quantity"
            type="numeric"
            value={expenseData.quantity}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Satuan"
            name="unit"
            type="numeric"
            placeholder="Gaji Manager"
            value={expenseData.unit}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Pengeluaran"
            name="amount"
            type="text"
            placeholder="(opsional)"
            value={formatCurrency(expenseData.amount)}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Total Pengeluaran"
            name="total_amount"
            type="text"
            placeholder="(opsional)"
            value={formatCurrency(expenseData.total_amount)}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Tahun"
            name="year"
            type="text"
            value={expenseData.year}
            onChange={handleNoOpChange}
            readOnly
          />
          <SelectForm
            label="Bulan"
            ariaLabel="Bulan"
            name="month"
            value={expenseData.month}
            options={getMonthOptions()}
            onChange={handleNoOpChange}
            disabled={true}
          />
        </>
      )}
    </Modal>
  );
};
export default DetailExpenseModal;
