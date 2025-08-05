import axios from "axios";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Select2Form from "../../../../components/Elements/Select2";
import InputForm from "../../../../components/Elements/Input";
import SelectForm from "../../../../components/Elements/Select";
import Card from "../../../../components/Elements/Card";
import Button from "../../../../components/Elements/Button";

const CreateSales = ({ isOpen, onClose }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();
  const [serviceLoading, setServiceLoading] = useState({
    service: false,
    priceSchemes: false,
  });
  const [errors, setErrors] = useState({});
  const [selectedService, setSelectedService] = useState([]);
  const [options, setOptions] = useState({
    service: [],
  });
  const [formData, setFormData] = useState({});
  const [services, setServices] = useState([]);
  const [priceSchemes, setPriceSchemes] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date();

  // Fetch price schemes based on selected service
  const fetchPriceSchemes = async (serviceId) => {
    try {
      setServiceLoading((prev) => ({ ...prev, priceSchemes: true }));

      const response = await axios.get(
        `${apiBaseUrl}/api/price-schemes?service_id=${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const schemes = response.data.data || [];
      setPriceSchemes(schemes);

      // Reset selected schemes when service changes
      setSelectedSchemes([]);
    } catch (error) {
      console.error("Error fetching price schemes:", error);
      showAlert("Gagal mengambil data skema harga", "error");
      setPriceSchemes([]);
    } finally {
      setServiceLoading((prev) => ({ ...prev, priceSchemes: false }));
    }
  };

  // Calculate total profit amount from selected schemes
  const calculateTotalProfitAmount = () => {
    return selectedSchemes.reduce((total, scheme) => {
      return total + (parseFloat(scheme.profit_amount) || 0);
    }, 0);
  };

  // Add scheme to selected schemes
  const addSchemePrice = () => {
    if (!priceSchemes || priceSchemes.length === 0) {
      showAlert("Tidak ada skema harga tersedia untuk layanan ini", "warning");
      return;
    }

    const newScheme = {
      id: Date.now(), // temporary ID for UI
      scheme_id: "",
      profit_amount: 0,
    };
    setSelectedSchemes([...selectedSchemes, newScheme]);
  };

  // Remove scheme from selected schemes
  const removeSchemePrice = (index) => {
    const updatedSchemes = selectedSchemes.filter((_, i) => i !== index);
    setSelectedSchemes(updatedSchemes);

    // Update HPP automatically after removal
    const newTotalProfit = updatedSchemes.reduce((total, scheme) => {
      return total + (parseFloat(scheme.profit_amount) || 0);
    }, 0);

    const originalHPP = parseFloat(formData.original_hpp) || 0;
    const newHPP = originalHPP + newTotalProfit;

    setFormData((prev) => ({
      ...prev,
      hpp: newHPP,
    }));
  };

  // Handle scheme selection change
  const handleSchemeChange = (index, e) => {
    const { value } = e.target;
    const selectedScheme = (priceSchemes || []).find(
      (scheme) => scheme.id.toString() === value
    );

    const updatedSchemes = [...selectedSchemes];
    updatedSchemes[index] = {
      ...updatedSchemes[index],
      scheme_id: value,
      profit_amount: selectedScheme ? selectedScheme.profit_amount : 0,
      level_name: selectedScheme ? selectedScheme.level_name : "",
    };

    setSelectedSchemes(updatedSchemes);

    // Update HPP automatically
    const newTotalProfit = updatedSchemes.reduce((total, scheme) => {
      return total + (parseFloat(scheme.profit_amount) || 0);
    }, 0);

    const originalHPP = parseFloat(formData.original_hpp) || 0;
    const newHPP = originalHPP + newTotalProfit;

    setFormData((prev) => ({
      ...prev,
      hpp: newHPP,
    }));
  };

  const getAvailablePriceSchemes = (currentIndex = null) => {
    const selectedSchemeIds = selectedSchemes
      .map((scheme, index) =>
        index !== currentIndex ? scheme.scheme_id : null
      )
      .filter((id) => id && id !== "");

    return priceSchemes.filter(
      (scheme) => !selectedSchemeIds.includes(scheme.id.toString())
    );
  };

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

      const totalProfitAmount = calculateTotalProfitAmount();
      const enhancedHPP =
        parseFloat(formData.original_hpp || 0) + totalProfitAmount;

      const submitData = {
        ...formData,
        hpp: enhancedHPP ? Math.floor(enhancedHPP) : undefined,
        selling_price: formData.selling_price
          ? Math.floor(parseFloat(formData.selling_price))
          : undefined,
        selected_schemes: selectedSchemes.filter((scheme) => scheme.scheme_id),
        total_profit_amount: totalProfitAmount,
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
        original_hpp: selectedServiceData?.hpp || "",
        hpp: selectedServiceData?.hpp || "",
        selling_price:
          selectedServiceData?.selling_price ||
          selectedServiceData?.price ||
          "",
      }));

      fetchPriceSchemes(selectedServiceId);
    } else {
      setFormData((prev) => ({
        ...prev,
        service_id: "",
        original_hpp: "",
        hpp: "",
        selling_price: "",
      }));
      setPriceSchemes([]);
      setSelectedSchemes([]);
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

    // Handle original_hpp changes
    if (name === "original_hpp") {
      const originalHPP = parseFloat(value) || 0;
      const totalProfitAmount = calculateTotalProfitAmount();
      const newHPP = originalHPP + totalProfitAmount;

      setFormData({
        ...formData,
        [name]: processedValue,
        hpp: newHPP,
      });
    } else if (name === "selling_price" && value !== "") {
      processedValue = Math.floor(parseFloat(value)) || "";
      setFormData({
        ...formData,
        [name]: processedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: processedValue,
      });
    }

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

      {/* Price Schemes Section */}
      {formData.service_id && priceSchemes.length > 1 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">
            Biaya Distribusi Tersedia
          </h3>

          {selectedSchemes.map((scheme, index) => (
            <Card key={scheme.id} className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">
                  Skema Distribusi Harga #{index + 1}
                </h4>
                {selectedSchemes.length > 1 && (
                  <Button
                    variant="danger"
                    onClick={() => removeSchemePrice(index)}
                    className="text-sm px-2 py-1"
                    type="button"
                  >
                    Hapus
                  </Button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Skema Harga *
                </label>
                <select
                  name={`scheme_${index}`}
                  value={scheme.scheme_id || ""}
                  onChange={(e) => handleSchemeChange(index, e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Skema Harga...</option>
                  {getAvailablePriceSchemes(index)
                    .slice(1)
                    .map((priceScheme) => (
                      <option key={priceScheme.id} value={priceScheme.id}>
                        {priceScheme.level_name} - Rp{" "}
                        {parseFloat(
                          priceScheme.profit_amount || 0
                        ).toLocaleString("id-ID")}
                      </option>
                    ))}
                </select>
                {errors[`scheme_${index}`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`scheme_${index}`]}
                  </p>
                )}
              </div>
            </Card>
          ))}

          <div className="mb-4">
            <Button
              onClick={addSchemePrice}
              variant="primary"
              className="w-full"
              type="button"
              disabled={serviceLoading.priceSchemes}
            >
              {serviceLoading.priceSchemes
                ? "Loading..."
                : "Tambah Skema Harga"}
            </Button>
          </div>
        </div>
      )}

      <InputForm
        label="HPP Total (Otomatis)"
        name="hpp"
        type="number"
        placeholder="100"
        value={formData.hpp || ""}
        onChange={() => {}} // Read-only
        error={errors.hpp}
        helperText={`HPP Dasar + Biaya Distribusi = Rp ${parseFloat(
          formData.original_hpp || 0
        ).toLocaleString(
          "id-ID"
        )} + Rp ${calculateTotalProfitAmount().toLocaleString("id-ID")}`}
        disabled={true}
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
