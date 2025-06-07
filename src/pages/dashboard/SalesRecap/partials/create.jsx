import axios from "axios";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Select2Form from "../../../../components/Elements/Select2";
import InputForm from "../../../../components/Elements/Input";

const CreateSales = ({ isOpen, onClose }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();
  const [serviceLoading, setServiceLoading] = useState({
    service: false,
  });
  const [errors, setErrors] = useState({});
  const [selectedService, setSelectedService] = useState([]);
  const [options, setOptions] = useState({
    service: [],
  });
  const [formData, setFormData] = useState({});
  const [services, setServices] = useState([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date();

  const handleCreateSales = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }
      if (!formData.service_id) {
        setErrors((prev) => ({ ...prev, service: "Layanan harus dipilih!" }));
        return;
      }

      const submitData = {
        ...formData,
        hpp: formData.hpp ? Math.floor(parseFloat(formData.hpp)) : undefined,
        selling_price: formData.selling_price
          ? Math.floor(parseFloat(formData.selling_price))
          : undefined,
      };

      await axios.post(`${apiBaseUrl}/api/sales`, submitData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showAlert("Rekap berhasil disimpan!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${error.response.data.message || "Gagal menyimpan "}`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    }
  };

  const formatDateForInput = () => {
    if (formData.year && formData.month && formData.date) {
      const year = formData.year;
      const month = formData.month.toString().padStart(2, "0");
      const date = formData.date.toString().padStart(2, "0");
      return `${year}-${month}-${date}`;
    }
    return "";
  };

  const handleDateInputChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const [year, month, date] = dateValue.split("-");
      setFormData((prev) => ({
        ...prev,
        year: year,
        month: parseInt(month).toString(),
        date: parseInt(date).toString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        year: "",
        month: "",
        date: "",
      }));
    }

    if (errors.year || errors.month || errors.date) {
      setErrors((prev) => ({
        ...prev,
        year: null,
        month: null,
        date: null,
      }));
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        setServiceLoading((prev) => ({ ...prev, service: true }));

        const response = await axios.get(`${apiBaseUrl}/api/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.data.data;

        setServices(data);

        const formattedData = data.map((service) => ({
          value: service.id,
          label: `${service.name} - ${service.sku}`,
        }));

        setOptions((prev) => ({ ...prev, service: formattedData }));
      } catch (error) {
        console.error("Error fetching services:", error);
        showAlert("Gagal mengambil data kategori", "error");
      } finally {
        setServiceLoading((prev) => ({ ...prev, service: false }));
      }
    };
    if (token) {
      fetchService();
    }
  }, [token, showAlert, setServiceLoading]);

  useEffect(() => {
    if (
      formData.year === currentYear.toString() &&
      parseInt(formData.month) > currentMonth
    ) {
      setFormData((prev) => ({
        ...prev,
        month: "",
        date: "",
      }));
    }
  }, [formData.year, currentMonth, currentYear, formData.month]);

  const handleserviceChange = (value) => {
    setSelectedService(value);
    if (value && value.length > 0) {
      const selectedServiceId = value[0].value;
      const selectedServiceData = services.find(
        (service) => service.id === selectedServiceId
      );

      setFormData((prev) => ({
        ...prev,
        service_id: selectedServiceId,
        hpp: selectedServiceData?.hpp || "",
        selling_price:
          selectedServiceData?.selling_price ||
          selectedServiceData?.price ||
          "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        service_id: "",
        hpp: "",
        selling_price: "",
      }));
    }
    if (errors.service || errors.service_id) {
      setErrors((prev) => ({
        ...prev,
        service: undefined,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === "checkbox" ? checked : value;

    if ((name === "hpp" || name === "selling_price") && value !== "") {
      processedValue = Math.floor(parseFloat(value)) || "";
    }

    setFormData({
      ...formData,
      [name]: processedValue,
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
      title="Tambah Penjualan"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleCreateSales}
      size="medium"
    >
      <InputForm
        label="Nama Klien"
        name="name"
        type="text"
        placeholder="Fauzan Barat"
        value={formData.name || ""}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Select2Form
        label="Layanan"
        name="service_id"
        placeholder="Pilih Layanan..."
        searchPlaceholder="Cari Layanan..."
        options={options.service}
        value={selectedService}
        onChange={handleserviceChange}
        error={errors.service || errors.service_id}
        isLoading={serviceLoading.service}
        required
      />

      <InputForm
        label="Tanggal"
        name="fullDate"
        type="date"
        value={formatDateForInput()}
        onChange={handleDateInputChange}
        error={errors.year || errors.month || errors.date}
        max={`${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}`}
        min={`${currentYear - 5}-01-01`}
        required
      />

      <InputForm
        label="Biaya Layanan Terjual"
        name="hpp"
        type="number"
        placeholder="100"
        value={formData.hpp || ""}
        onChange={handleChange}
        error={errors.hpp}
        helperText="Harga Pokok Layanan per unit yang terjual"
        required
      />
      <InputForm
        label="Harga Terjual"
        name="selling_price"
        type="number"
        placeholder="100"
        value={formData.selling_price || ""}
        onChange={handleChange}
        error={errors.selling_price}
        helperText="Harga Jual Layanan per unit yang terjual"
        required
      />
    </ModalForm>
  );
};

export default CreateSales;
