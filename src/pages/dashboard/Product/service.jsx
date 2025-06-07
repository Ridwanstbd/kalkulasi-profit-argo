import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiBaseUrl } from "../../../config/api";
import { useAuth } from "../../../contexts/AuthContext";
import Widget from "../../../components/Elements/Widget/Widget";
import CreateServiceModal from "./partials/create";
import useDocumentHead from "../../../hooks/useDocumentHead";
import DataTable from "../../../components/Fragments/DataTable";
import TableActions from "../../../components/Elements/TableActions";
import Card from "../../../components/Elements/Card";
import Loading from "../../../components/Elements/Loading";
import axios from "axios";
import DetailServiceModal from "./partials/detail";
import EditServiceModal from "./partials/edit";
import DeleteServiceModal from "./partials/delete";
import Header from "../../../components/Fragments/Header";

const Service = () => {
  const { setPageTitle, setPageDescription } = useOutletContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showAlert } = useOutletContext();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    total_services: 0,
    avg_selling_price: 0,
    avg_hpp: 0,
    total_selling_value: 0,
    total_hpp_value: 0,
    profit_margin: 0,
  });
  const pageInfo = {
    title: "Layanan Saya",
    description:
      "Halaman ini untuk mengelola Layanan yang kamu butuhkan, mulai dari membuat mengubah dan menghapus",
  };
  useDocumentHead(pageInfo);

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/api/services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.data || []);

        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        showAlert(
          `Gagal memuat data: ${
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

  const handleDetail = (row) => {
    setSelectedServiceId(row.id);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedServiceId(row.id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedServiceId(row.id);
    setIsDeleteModalOpen(true);
  };

  const handleServiceDeleted = (deletedServiceId) => {
    setData(data.filter((item) => item.id !== deletedServiceId));
    showAlert("Layanan berhasil dihapus", "success");

    setStats({
      ...stats,
      total_services: stats.total_services - 1,
    });
  };

  const columns = [
    {
      accessor: "rowNumber",
      name: "No",
      sortable: false,
    },
    {
      accessor: "name",
      name: "Nama",
      sortable: true,
      filterable: true,
    },
    {
      accessor: "sku",
      name: "Kode",
      sortable: true,
      filterable: true,
    },
    {
      accessor: "hpp",
      name: "Harga Pokok Layanan",
      sortable: true,
      filterable: true,
      cell: (row) => `Rp ${parseFloat(row.hpp).toLocaleString("id-ID")}`,
    },
    {
      accessor: "selling_price",
      name: "Harga Retail",
      sortable: true,
      filterable: true,
      cell: (row) =>
        `Rp ${parseFloat(row.selling_price).toLocaleString("id-ID")}`,
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

  if (loading) {
    return <Loading />;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Header>
        <Widget
          title="Layanan"
          count={stats.total_services}
          status="Jumlah"
          description="jumlah Layanan tersimpan"
        />
        <Widget
          title="Harga Retail"
          count={formatCurrency(stats.avg_selling_price)}
          status="Rata-rata"
          description="harga retail Layanan"
        />
        <Widget
          title="Harga Pokok Layanan"
          count={formatCurrency(stats.avg_hpp)}
          status="Rata-rata"
          description="harga pokok Layanan"
        />
        <Widget
          title="Harga Pokok Layanan"
          count={formatCurrency(stats.total_hpp_value)}
          status="Total"
          description="harga pokok Layanan"
        />
        <Widget
          title="Margin Layanan"
          count={formatCurrency(stats.profit_margin)}
          status="Total"
          description="margin Layanan"
        />
        <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
          Tambah Layanan
        </Button>
        <CreateServiceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Header>

      <Card className="space-y-4 gap-2">
        <DataTable
          data={data}
          columns={columns}
          pagination={true}
          filterable={true}
        />
        <DetailServiceModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          Service_id={selectedServiceId}
        />
        <EditServiceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          Service_id={selectedServiceId}
        />
        <DeleteServiceModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          Service_id={selectedServiceId}
          onServiceDeleted={handleServiceDeleted}
        />
      </Card>
    </>
  );
};
export default Service;
