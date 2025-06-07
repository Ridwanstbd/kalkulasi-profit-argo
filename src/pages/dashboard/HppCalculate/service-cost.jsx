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
import CreateServiceCostModal from "./partials/create";
import TableActions from "../../../components/Elements/TableActions";
import DetailServiceCostModal from "./partials/detail";
import EditServiceCostModal from "./partials/edit";
import DeleteServiceCostModal from "./partials/delete";

const ServiceCost = () => {
  const { setPageTitle, setPageDescription } = useOutletContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showAlert } = useOutletContext();
  const [data, setData] = useState([]);

  const [options, setOptions] = useState({
    service: [],
  });
  const [serviceHPP, setserviceHPP] = useState("-");

  const pageInfo = {
    title: "Harga Pokok Layanan Saya",
    description:
      "Halaman ini untuk mengelola harga pokok Layanan yang kamu butuhkan, mulai dari membuat mengubah dan menghapus",
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
    showAlert("HPP berhasil dihapus", "success");
  };

  const handleserviceChange = async (selectedOptions) => {
    const newSelectedService =
      selectedOptions && selectedOptions.length > 0 ? selectedOptions[0] : null;

    setSelectedService(newSelectedService);

    if (newSelectedService) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/service-cost?service_id=${newSelectedService.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const processedData = (response.data.data || []).map((item) => ({
          ...item,
          cost_component_name: item.cost_component?.name || "-",
          service_name: item.service?.name || "-",
          service_sku: item.service?.sku || "-",
        }));

        setData(processedData);

        const serviceResponse = await axios.get(
          `${apiBaseUrl}/api/services/${newSelectedService.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (serviceResponse.data?.data) {
          setserviceHPP(serviceResponse.data.data.hpp || "-");
        } else {
          setserviceHPP("-");
        }
      } catch (error) {
        console.error("Error fetching service HPP:", error);
        showAlert("Gagal memuat ulang data produk", "error");
        setserviceHPP("-");
      } finally {
        setLoading(false);
      }
    } else {
      setData(data);
      setserviceHPP("-");
    }
  };

  const handleOpenModal = () => {
    if (!selectedService) {
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
        const response = await axios.get(`${apiBaseUrl}/api/service-cost`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const processedData = (response.data.data || []).map((item) => ({
          ...item,
          cost_component_name: item.cost_component?.name || "-",
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
            setSelectedService(defaultservice);

            const filteredData = processedData.filter(
              (item) => item.service_id === defaultservice.value
            );
            setData(filteredData);

            if (response.data.service.hpp) {
              setserviceHPP(response.data.service.hpp);
            }
          }
        }
      } catch (error) {
        showAlert(
          `Gagal memuat data produk: ${
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
      accessor: "cost_component_name",
      name: "Nama Komponen",
      sortable: true,
      filterable: true,
      cell: (row) => row.cost_component?.name || "-",
    },
    {
      accessor: "conversion_qty",
      name: "Jumlah beli",
      cell: (row) => `${row.conversion_qty} ${row.unit}`,
    },
    {
      accessor: "unit_price",
      name: "Harga Beli",
      sortable: true,
      filterable: true,
      cell: (row) => `Rp ${parseFloat(row.unit_price).toLocaleString("id-ID")}`,
    },
    {
      accessor: "quantity",
      name: "Kebutuhan produk",
      cell: (row) => `${row.quantity} ${row.unit}`,
    },
    {
      accessor: "amount",
      name: "Biaya",
      sortable: true,
      filterable: true,
      cell: (row) => `Rp ${parseFloat(row.amount).toLocaleString("id-ID")}`,
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
          value={selectedService ? [selectedService] : []}
          onChange={handleserviceChange}
          options={options.service}
          placeholder="Pilih produk"
        />
        <div>
          <Label htmlFor="hpp">HPP</Label>
          <h3 className="font-bold text-xl">
            {serviceHPP !== "-"
              ? `Rp ${parseFloat(serviceHPP).toLocaleString("id-ID")}`
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
            Tambah Biaya Produksi
          </Button>
          {isAddModalOpen && selectedService && (
            <CreateServiceCostModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              service_id={selectedService.value}
              service_name={selectedService.label}
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
        <DetailServiceCostModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          service_cost_id={selectedId}
        />
        <EditServiceCostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          service_cost_id={selectedId}
        />
        <DeleteServiceCostModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          service_cost_id={selectedId}
          onDeleted={handleDeleted}
        />
      </Card>
    </>
  );
};
export default ServiceCost;
