import axios from "axios";
import Loading from "../../../../components/Elements/Loading";
import Modal from "../../../../components/Fragments/Modal";
import { apiBaseUrl } from "../../../../config/api";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import InputForm from "../../../../components/Elements/Input";
import Checkbox from "../../../../components/Elements/Checkbox";

const DetailCategoryModal = ({ isOpen, onClose, category_id }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    is_salary: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!category_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/expense-categories/${category_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setCategoryData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && token && category_id) {
      fetchProduct();
    }
  }, [token, category_id, isOpen]);

  const handleNoOpChange = () => {};

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
            label="Deskripsi Kategori"
            name="description"
            type="textarea"
            placeholder="(opsional)"
            value={categoryData.description}
            onChange={handleNoOpChange}
            readOnly
          />
          <Checkbox
            name="is_salary"
            onChange={handleNoOpChange}
            checked={categoryData.is_salary}
            label="Bagian Biaya Gaji"
            readOnly
          />
        </>
      )}
    </Modal>
  );
};
export default DetailCategoryModal;
