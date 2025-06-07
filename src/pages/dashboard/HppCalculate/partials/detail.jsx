import { useEffect, useState } from "react";
import Loading from "../../../../components/Elements/Loading";
import Modal from "../../../../components/Fragments/Modal";
import InputForm from "../../../../components/Elements/Input";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";
import SelectForm from "../../../../components/Elements/Select";

const DetailHPPModal = ({ isOpen, onClose, service_cost_id }) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serviceCostData, setServiceCostData] = useState({
    id: "",
    service_id: "",
    cost_component_id: "",
    unit: "",
    unit_price: "",
    quantity: "",
    conversion_qty: "",
    amount: "",
  });
  const [costComponentData, setCostComponentData] = useState({
    id: "",
    user_id: user?.id,
    name: "",
    description: null,
    component_type: "",
  });
  useEffect(() => {
    const fetchComponent = async () => {
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
          setServiceCostData(response.data.data);
        }
        if (response.data && response.data.data.cost_component) {
          setCostComponentData(response.data.data.cost_component);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && token && service_cost_id) {
      fetchComponent();
    }
  }, [service_cost_id, token, isOpen]);
  const handleNoOpChange = () => {};
  const componentTypeOptions = [
    { value: "", label: "Pilih Bahan Baku" },
    { value: "direct_material", label: "Bahan Baku Langsung" },
    { value: "indirect_material", label: "Bahan Baku Tidak Langsung" },
    { value: "direct_labor", label: "Tenaga Kerja Langsung" },
    { value: "overhead", label: "Overhead" },
    { value: "packaging", label: "Pengemasan" },
    { value: "other", label: "Lainnya" },
  ];
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
            label="Nama Komponen"
            name="name"
            type="text"
            placeholder="Kain"
            value={costComponentData.name}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <SelectForm
            label="Tipe Komponen"
            name="component_type"
            value={costComponentData.component_type}
            onChange={handleNoOpChange}
            options={componentTypeOptions}
            ariaLabel="Tipe Komponen"
            className="w-full"
            disabled={true}
          />
          <InputForm
            label="Jumlah Beli"
            name="conversion_qty"
            type="text"
            placeholder=""
            value={`${serviceCostData.conversion_qty} - ${serviceCostData.unit}`}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Harga Beli"
            name="unit_price"
            type="text"
            placeholder=""
            value={formatCurrency(serviceCostData.unit_price)}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Kebutuhan Layanan"
            name="quantity"
            type="text"
            placeholder=""
            value={`${serviceCostData.quantity} - ${serviceCostData.unit}`}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Biaya"
            name="amount"
            type="text"
            placeholder=""
            value={formatCurrency(serviceCostData.amount)}
            onChange={handleNoOpChange}
            readOnly={true}
          />
        </>
      )}
    </Modal>
  );
};
export default DetailHPPModal;
