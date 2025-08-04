import { useEffect, useState } from "react";
import Card from "../../../components/Elements/Card";
import DataTable from "../../../components/Fragments/DataTable";
import Header from "../../../components/Fragments/Header";
import useDocumentHead from "../../../hooks/useDocumentHead";
import axios from "axios";
import { apiBaseUrl } from "../../../config/api";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../../components/Elements/Loading";
import Label from "../../../components/Elements/Input/Label";
import Button from "../../../components/Elements/Button";
import Select2Form from "../../../components/Elements/Select2";
import TableActions from "../../../components/Elements/TableActions";
import CreatePricingModal from "./partials/create";
import DetailPricingModal from "./partials/detail";
import EditPricingModal from "./partials/edit";
import DeletePricingModal from "./partials/delete";

const Pricing = () => {
  const { setPageTitle, setPageDescription } = useOutletContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedservice, setSelectedservice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showAlert } = useOutletContext();
  const [data, setData] = useState([]);

  const [options, setOptions] = useState({
    service: [],
  });
  const [serviceCost, setServiceCost] = useState("-");
  const [servicePrice, setServicePrice] = useState("-");

  const pageInfo = {
    title: "Smart Pricing",
    description:
      "Manajemen harga layanan agar lebih efisien dan menguntungkan.",
  };
  useDocumentHead(pageInfo);

  const handleDetail = (row) => {
    setSelectedId(row.id);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedId(row.id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedId(row.id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleted = (deletedId) => {
    setData(data.filter((item) => item.id !== deletedId));
    showAlert("Skema berhasil dihapus", "success");
  };

  const handleserviceChange = async (selectedOptions) => {
    const newSelectedservice =
      selectedOptions && selectedOptions.length > 0 ? selectedOptions[0] : null;

    setSelectedservice(newSelectedservice);

    if (newSelectedservice) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/price-schemes?service_id=${newSelectedservice.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const processedData = (response.data.data || []).map((item) => ({
          ...item,
          service_name: item.service?.name || "-",
          service_sku: item.service?.sku || "-",
        }));

        setData(processedData);

        const serviceResponse = await axios.get(
          `${apiBaseUrl}/api/services/${newSelectedservice.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (serviceResponse.data?.data) {
          setServiceCost(serviceResponse.data.data.hpp || "-");
          setServicePrice(serviceResponse.data.data.selling_price || "-");
        } else {
          setServiceCost("-");
          setServicePrice("-");
        }
      } catch (error) {
        console.error("Error fetching service HPP:", error);
        showAlert("Gagal memuat ulang data Layanan", "error");
        setServiceCost("-");
        setServicePrice("-");
      } finally {
        setLoading(false);
      }
    } else {
      setData(data);
      setServiceCost("-");
      setServicePrice("-");
    }
  };

  const handleOpenModal = () => {
    if (!selectedservice) {
      showAlert("Silakan pilih Layanan terlebih dahulu", "warning");
      return;
    }
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/api/price-schemes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const processedData = (response.data.data || []).map((item) => ({
          ...item,
          service_name: item.service?.name || "-",
          service_sku: item.service?.sku || "-",
        }));

        setData(processedData);
        if (
          response.data.all_services &&
          Array.isArray(response.data.all_services)
        ) {
          const serviceOptions = response.data.all_services.map((service) => ({
            value: service.id,
            label: `${service.name} (${service.sku})`,
          }));

          setOptions((prev) => ({
            ...prev,
            service: serviceOptions,
          }));

          if (serviceOptions.length > 0 && response.data.service) {
            const defaultservice = {
              value: response.data.service.id,
              label: `${response.data.service.name} (${response.data.service.sku})`,
            };
            setSelectedservice(defaultservice);

            const filteredData = processedData.filter(
              (item) => item.service_id === defaultservice.value
            );
            setData(filteredData);

            if (response.data.service.hpp) {
              setServiceCost(response.data.service.hpp);
            }
            if (response.data.service.selling_price) {
              setServicePrice(response.data.service.selling_price);
            }
          }
        }
      } catch (error) {
        showAlert(
          `Gagal memuat data Layanan: ${
            error.response?.data?.message || error.message
          }`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchServices();
    }
  }, [
    setPageTitle,
    setPageDescription,
    pageInfo.title,
    pageInfo.description,
    token,
    showAlert,
  ]);

  if (loading) {
    return <Loading />;
  }

  const columns = [
    {
      accessor: "rowNumber",
      name: "No",
      sortable: false,
    },
    {
      accessor: "level_name",
      name: "Level Distribusi",
      sortable: true,
      filterable: true,
    },
    {
      accessor: "purchase_price",
      name: "Harga Beli",
      sortable: true,
      filterable: true,
      cell: (row) =>
        `Rp ${parseFloat(row.purchase_price).toLocaleString("id-ID")}`,
    },
    {
      accessor: "selling_price",
      name: "Harga Jual",
      sortable: true,
      filterable: true,
      cell: (row) =>
        `Rp ${parseFloat(row.selling_price).toLocaleString("id-ID")}`,
    },
    {
      accessor: "profit_amount",
      name: "Keuntungan",
      sortable: true,
      filterable: true,
      cell: (row) =>
        `Rp ${parseFloat(row.profit_amount).toLocaleString("id-ID")}`,
    },
    {
      key: "button-actions",
      name: "Aksi",
      sortable: false,
      filterable: false,
      cell: (row) => (
        <TableActions
          row={row}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={() => handleDelete(row)}
          size="md"
        />
      ),
    },
  ];

  return (
    <>
      <Header>
        <Select2Form
          label="Produk"
          name="service_id"
          value={selectedservice ? [selectedservice] : []}
          onChange={handleserviceChange}
          options={options.service}
          placeholder="Pilih Layanan"
        />

        <div>
          <Label htmlFor="hpp">Harga Jual Layanan</Label>
          <h3 className="font-bold text-xl">
            {servicePrice !== "-"
              ? `Rp ${parseFloat(servicePrice).toLocaleString("id-ID")}`
              : "-"}
          </h3>
        </div>

        <div>
          <Label htmlFor="hpp">HPP</Label>
          <h3 className="font-bold text-xl">
            {serviceCost !== "-"
              ? `Rp ${parseFloat(serviceCost).toLocaleString("id-ID")}`
              : "-"}
          </h3>
        </div>

        <div>
          <Label htmlFor="add">Aksi</Label>
          <Button
            onClick={handleOpenModal}
            variant="primary"
            className="w-full"
          >
            Tambah Skema Harga
          </Button>
          {isAddModalOpen && selectedservice && (
            <CreatePricingModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              service_id={selectedservice.value}
              service_name={selectedservice.label}
            />
          )}
        </div>
      </Header>
      <Card className="space-y-4 gap-2">
        <DataTable
          data={data}
          columns={columns}
          pagination={true}
          filterable={true}
        />
        <DetailPricingModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          price_id={selectedId}
        />
        <EditPricingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          price_id={selectedId}
        />
        <DeletePricingModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          price_id={selectedId}
          onDeleted={handleDeleted}
        />
      </Card>
    </>
  );
};

export default Pricing;
