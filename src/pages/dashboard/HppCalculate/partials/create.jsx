import axios from "axios";
import ModalForm from "../../../../components/Fragments/ModalForm";
import { apiBaseUrl } from "../../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Select2Form from "../../../../components/Elements/Select2";
import InputForm from "../../../../components/Elements/Input";
import SelectForm from "../../../../components/Elements/Select";
import Button from "../../../../components/Elements/Button";
import Card from "../../../../components/Elements/Card";

const CreateHPPModal = ({ isOpen, onClose, product_id, product_name }) => {
  const { showAlert } = useOutletContext();
  const { token } = useAuth();
  const [costComponentLoading, setCostComponentLoading] = useState(false);
  const [options, setOptions] = useState({
    costComponent: [],
  });

  const [errors, setErrors] = useState({});
  const [costComponents, setCostComponents] = useState([
    {
      id: 1,
      selectedComponent: [],
      cost_component_id: "",
      unit: "",
      unit_price: "",
      quantity: "",
      conversion_qty: "",
    },
  ]);

  const preparePayload = () => {
    const costs = costComponents.map((component) => ({
      cost_component_id: component.cost_component_id,
      unit: component.unit,
      unit_price: Number(component.unit_price),
      quantity: Number(component.quantity),
      conversion_qty: Number(component.conversion_qty),
    }));

    return {
      product_id: Number(product_id),
      costs: costs,
    };
  };

  const handleCreateHPP = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!token) {
        throw new Error("Anda belum login, silakan login terlebih dahulu");
      }

      // Validate that all cost components have required fields
      const hasEmptyFields = costComponents.some(
        (comp) =>
          !comp.cost_component_id ||
          !comp.unit ||
          !comp.unit_price ||
          !comp.quantity ||
          !comp.conversion_qty
      );

      if (hasEmptyFields) {
        setErrors((prev) => ({
          ...prev,
          costs: "Semua komponen biaya harus diisi lengkap!",
        }));
        return;
      }

      const dataToSubmit = preparePayload();

      await axios.post(`${apiBaseUrl}/v1/hpp`, dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showAlert("HPP berhasil disimpan!", "success");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        showAlert(
          `Error: ${
            error.response.data.message || "Gagal menyimpan biaya produksi"
          }`,
          "error"
        );
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    }
  };

  useEffect(() => {
    const fetchCostComponents = async () => {
      try {
        setCostComponentLoading(true);

        const response = await axios.get(`${apiBaseUrl}/v1/cost-components`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;

        const formattedData = data.map((cost) => ({
          value: cost.id,
          label: cost.name,
        }));

        setOptions((prev) => ({ ...prev, costComponent: formattedData }));
      } catch (error) {
        console.error("Error fetching cost components:", error);
        showAlert("Gagal mengambil data komponen biaya", "error");
      } finally {
        setCostComponentLoading(false);
      }
    };

    if (token) {
      fetchCostComponents();
    }
  }, [token, showAlert]);

  const handleCostComponentChange = (index, selectedOptions) => {
    const updatedComponents = [...costComponents];
    updatedComponents[index].selectedComponent = selectedOptions;

    if (selectedOptions && selectedOptions.length > 0) {
      updatedComponents[index].cost_component_id = selectedOptions[0].value;
    } else {
      updatedComponents[index].cost_component_id = "";
    }

    setCostComponents(updatedComponents);

    if (errors.costs) {
      setErrors((prev) => ({
        ...prev,
        costs: undefined,
      }));
    }
  };

  const handleComponentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedComponents = [...costComponents];
    updatedComponents[index][name] = value;
    setCostComponents(updatedComponents);

    if (errors.costs) {
      setErrors((prev) => ({
        ...prev,
        costs: undefined,
      }));
    }
  };

  const addCostComponent = () => {
    setCostComponents([
      ...costComponents,
      {
        id: costComponents.length + 1,
        selectedComponent: [],
        cost_component_id: "",
        unit: "",
        unit_price: "",
        quantity: "",
        conversion_qty: "",
      },
    ]);
  };

  const removeCostComponent = (index) => {
    if (costComponents.length > 1) {
      const updatedComponents = [...costComponents];
      updatedComponents.splice(index, 1);
      setCostComponents(updatedComponents);
    }
  };

  const unitOptions = [
    { value: "", label: "Pilih Satuan" },
    { value: "meter", label: "meter" },
    { value: "cm", label: "cm" },
    { value: "pcs", label: "pcs" },
    { value: "set", label: "set" },
    { value: "ml", label: "ml" },
  ];

  return (
    <ModalForm
      id="modal-create-hpp"
      title={`Tambah Biaya Produksi: ${product_name || "Produk"}`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleCreateHPP}
      size="large"
    >
      {errors.costs && typeof errors.costs === "string" && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.costs}
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              Mengatur HPP untuk:{" "}
              <span className="font-bold">
                {product_name || `Produk ID: ${product_id}`} dalam sekali
                masak/produksi
              </span>
            </p>
          </div>
        </div>
      </div>

      {costComponents.map((component, index) => (
        <Card key={component.id} className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2>Komponen Biaya #{index + 1}</h2>
            {costComponents.length > 1 && (
              <Button
                variant="danger"
                onClick={() => removeCostComponent(index)}
                className="text-sm px-2 py-1"
              >
                Hapus
              </Button>
            )}
          </div>

          <Select2Form
            label="Komponen Biaya"
            name="cost_component_id"
            placeholder="Pilih Komponen Biaya..."
            searchPlaceholder="Cari komponen biaya..."
            options={options.costComponent}
            value={component.selectedComponent}
            onChange={(selected) => handleCostComponentChange(index, selected)}
            error={errors.cost_component_id}
            isLoading={costComponentLoading}
            required
          />

          <SelectForm
            label="Satuan Kebutuhan"
            ariaLabel="Unit"
            name="unit"
            type="text"
            value={component.unit}
            options={unitOptions}
            onChange={(e) => handleComponentChange(index, e)}
            error={errors.unit}
            disabled={false}
            helperText="Satuan kebutuhan untuk 1 produk jadi"
          />

          <InputForm
            label="Harga (Beli)"
            name="unit_price"
            type="number"
            placeholder="2990000"
            value={component.unit_price}
            onChange={(e) => handleComponentChange(index, e)}
            error={errors.unit_price}
            required
          />

          <InputForm
            label="Kuantitas Kebutuhan"
            name="quantity"
            type="number"
            placeholder="1"
            value={component.quantity}
            onChange={(e) => handleComponentChange(index, e)}
            error={errors.quantity}
            helperText="Kuantitas kebutuhan untuk 1 produk jadi"
            required
          />

          <InputForm
            label="Kuantitas Pembelian"
            name="conversion_qty"
            type="number"
            placeholder="1"
            value={component.conversion_qty}
            onChange={(e) => handleComponentChange(index, e)}
            error={errors.conversion_qty}
            helperText="Jumlah beli barang yang dikonversi dalam satuan beli"
            required
          />
        </Card>
      ))}

      <div className="mb-4">
        <Button
          onClick={addCostComponent}
          variant="primary"
          className="w-full"
          type="button"
        >
          Tambah Komponen Biaya
        </Button>
      </div>
    </ModalForm>
  );
};

export default CreateHPPModal;
