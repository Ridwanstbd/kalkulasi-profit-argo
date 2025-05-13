import { useEffect, useState } from "react";
import Loading from "../../../../components/Elements/Loading";
import Modal from "../../../../components/Fragments/Modal";
import InputForm from "../../../../components/Elements/Input";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";

const DetailPricingModal = ({ isOpen, onClose, price_id }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState({});
  useEffect(() => {
    const fetchComponent = async () => {
      if (!price_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/v1/price-schemes/${price_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setPriceData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && token && price_id) {
      fetchComponent();
    }
  }, [price_id, token, isOpen]);
  const handleNoOpChange = () => {};

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
      id="modal-detail-hpp"
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Komponen"
      size="medium"
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <InputForm
            label="Nama Level"
            name="level_name"
            type="text"
            placeholder=""
            value={priceData.level_name}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Tingkat Level"
            name="level_order"
            type="text"
            placeholder=""
            value={priceData.level_order}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Persentase Margin"
            name="percentage_discount"
            type="text"
            placeholder=""
            value={formatPercentage(priceData.discount_percentage)}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Harga Beli"
            name="purchase_price"
            type="text"
            placeholder=""
            value={formatCurrency(priceData.purchase_price)}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Harga Jual"
            name="selling_price"
            type="text"
            placeholder=""
            value={formatCurrency(priceData.selling_price)}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Keuntungan"
            name="profit_amount"
            type="text"
            placeholder=""
            value={formatCurrency(priceData.profit_amount)}
            onChange={handleNoOpChange}
            readOnly={true}
          />
        </>
      )}
    </Modal>
  );
};
export default DetailPricingModal;
