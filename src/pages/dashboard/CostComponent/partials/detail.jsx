import { useEffect, useState } from "react";
import Loading from "../../../../components/Elements/Loading";
import Modal from "../../../../components/Fragments/Modal";
import InputForm from "../../../../components/Elements/Input";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";
import SelectForm from "../../../../components/Elements/Select";

const DetailComponent = ({ isOpen, onClose, id }) => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);

  const [componentData, setComponentData] = useState({
    name: "",
    description: "",
    component_type: "",
  });
  useEffect(() => {
    const fetchComponent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/cost-components/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setComponentData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && token && id) {
      fetchComponent();
    }
  }, [id, token, isOpen]);
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

  return (
    <Modal
      id="modal-detail-component"
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
            placeholder="Dress A"
            value={componentData.name}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <InputForm
            label="Deskripsi Komponen"
            name="description"
            type="textarea"
            placeholder="(opsional)"
            value={componentData.description}
            onChange={handleNoOpChange}
            readOnly={true}
          />
          <SelectForm
            label="Tipe Komponen"
            name="component_type"
            value={componentData.component_type}
            onChange={handleNoOpChange}
            options={componentTypeOptions}
            ariaLabel="Tipe Komponen"
            className="w-full"
            disabled={true}
          />
        </>
      )}
    </Modal>
  );
};
export default DetailComponent;
