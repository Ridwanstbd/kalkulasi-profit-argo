import axios from "axios";
import Loading from "../../../../components/Elements/Loading";
import Modal from "../../../../components/Fragments/Modal";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import InputForm from "../../../../components/Elements/Input";
import SelectForm from "../../../../components/Elements/Select";

const DetailSalesModal = ({ isOpen, onClose, sales_id }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState({});

  useEffect(() => {
    const fetchSales = async () => {
      if (!sales_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/sales/${sales_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setSalesData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && token && sales_id) {
      fetchSales();
    }
  }, [token, sales_id, isOpen]);

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

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "0%";
    }
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return `${numValue.toFixed(2)}%`;
  };

  return (
    <Modal
      id="modal-detail-category"
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Rekap"
      size="medium"
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <InputForm
            label="Nama Klien"
            name="name"
            type="text"
            placeholder=""
            value={salesData.name}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Nama Layanan"
            name="name"
            type="text"
            placeholder="Dress A"
            value={salesData.service_name}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Tahun"
            name="year"
            type="text"
            value={salesData.year}
            onChange={handleNoOpChange}
            readOnly
          />
          <SelectForm
            label="Bulan"
            ariaLabel="Bulan"
            name="month"
            value={salesData.month}
            options={getMonthOptions()}
            onChange={handleNoOpChange}
            disabled={true}
          />
          <InputForm
            label="Tanggal"
            name="date"
            type="numeric"
            value={salesData.date}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="HPP Terjual"
            name="hpp"
            type="text"
            placeholder=""
            value={formatCurrency(salesData.hpp)}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Harga Terjual"
            name="selling_price"
            type="text"
            placeholder=""
            value={formatCurrency(salesData.selling_price)}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Keuntungan Layanan"
            name="unit"
            type="text"
            placeholder=""
            value={formatCurrency(salesData.profit_unit)}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Persentase Profit dari Layanan"
            name="profit_percentage"
            type="text"
            placeholder="(opsional)"
            value={formatPercentage(salesData.profit_percentage)}
            onChange={handleNoOpChange}
            readOnly
          />
          <InputForm
            label="Kontribusi Persentase Profit"
            name="profit_contribution_percentage"
            type="text"
            placeholder="(opsional)"
            value={formatPercentage(salesData.profit_contribution_percentage)}
            onChange={handleNoOpChange}
            helperText="kontribusi keuntungan untuk bulan terpilih"
            readOnly
          />
        </>
      )}
    </Modal>
  );
};
export default DetailSalesModal;
