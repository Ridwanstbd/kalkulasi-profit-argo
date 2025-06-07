import axios from "axios";
import Checkbox from "../../../../components/Elements/Checkbox";
import InputForm from "../../../../components/Elements/Input";
import Loading from "../../../../components/Elements/Loading";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";

const EditCategoryModal = ({ isOpen, onClose, category_id }) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: user?.id,
    name: "",
    description: "",
    is_salary: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComponent = async () => {
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
          const categoryData = response.data.data;

          setFormData({
            user_id: user?.id,
            name: categoryData.name || "",
            description: categoryData.description || "",
            is_salary: categoryData.is_salary || "",
          });
        }
      } catch (error) {
        console.error("Error fetching component detail:", error);
        showAlert("error", "Gagal memngambil data Kategori");
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && token && category_id) {
      fetchComponent();
    }
  }, [token, category_id, isOpen, user?.id, showAlert]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama Kategori tidak boleh kosong";
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
        `${apiBaseUrl}/api/expense-categories/${category_id}`,
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
          <InputForm
            label="Nama Kategori"
            name="name"
            type="text"
            placeholder="Gaji Manager"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <InputForm
            label="Deskripsi Kategori"
            name="description"
            type="textarea"
            placeholder="(opsional)"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
          />
          <Checkbox
            name="is_salary"
            onChange={handleChange}
            checked={formData.is_salary}
            label="Bagian Biaya Gaji"
          />
        </>
      )}
    </ModalForm>
  );
};
export default EditCategoryModal;
