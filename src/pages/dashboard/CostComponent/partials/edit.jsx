import { useOutletContext } from "react-router-dom";
import InputForm from "../../../../components/Elements/Input";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import Loading from "../../../../components/Elements/Loading";
import SelectForm from "../../../../components/Elements/Select";

const EditComponent = ({ isOpen, onClose, id }) => {
  const { showAlert } = useOutletContext();
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: user?.id,
    name: "",
    description: "",
    component_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
          const componentData = response.data.data;

          setFormData({
            user_id: user?.id,
            name: componentData.name || "",
            description: componentData.description || "",
            component_type: componentData.component_type || "",
          });
        }
      } catch (error) {
        console.error("Error fetching component detail:", error);
        showAlert("error", "Gagal memngambil data komponen");
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && token && id) {
      fetchComponent();
    }
  }, [token, id, isOpen, user?.id, showAlert]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama Komponen tidak boleh kosong";
    }

    if (!formData.component_type.trim()) {
      newErrors.component_type = "Tipe Komponen tidak boleh kosong";
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
        `${apiBaseUrl}/api/cost-components/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        showAlert("Komponen berhasil diperbarui", "success");
        onClose();
      } else {
        showAlert(
          response.data?.message || "Gagal memperbarui komponen",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating component:", error);

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
          error.response?.data?.message || "Gagal memperbarui produk"
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
    <ModalForm
      id="modal-edit-component"
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Komponen"
      size="medium"
      onSubmit={handleSubmit}
      submitting={submitting}
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
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <InputForm
            label="Deskripsi Komponen"
            name="description"
            type="textarea"
            placeholder="(opsional)"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
          />
          <SelectForm
            label="Tipe Komponen"
            name="component_type"
            value={formData.component_type}
            onChange={handleChange}
            options={componentTypeOptions}
            ariaLabel="Tipe Komponen"
            disabled={false}
          />
        </>
      )}
    </ModalForm>
  );
};
export default EditComponent;
