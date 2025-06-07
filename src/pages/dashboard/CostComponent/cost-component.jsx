import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useDocumentHead from "../../../hooks/useDocumentHead";
import axios from "axios";
import { apiBaseUrl } from "../../../config/api";
import Loading from "../../../components/Elements/Loading";
import Button from "../../../components/Elements/Button";
import DataTable from "../../../components/Fragments/DataTable";
import TableActions from "../../../components/Elements/TableActions";
import CreateComponent from "./partials/create";
import Card from "../../../components/Elements/Card";
import Header from "../../../components/Fragments/Header";
import DetailComponent from "./partials/detail";
import EditComponent from "./partials/edit";
import DeleteComponentModal from "./partials/delete";

const CostComponent = () => {
  const { setPageTitle, setPageDescription } = useOutletContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showAlert } = useOutletContext();
  const [data, setData] = useState([]);

  const pageInfo = {
    title: "Komponen Biaya Saya",
    description:
      "Halaman ini untuk mengelola Komponen Biaya yang kamu butuhkan, mulai dari membuat mengubah dan menghapus",
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
    showAlert("Komponen berhasil dihapus", "success");
  };

  // Function to format component_type values
  const formatComponentType = (value) => {
    const typeMap = {
      direct_material: "Bahan Baku Langsung",
      direct_labor: "Tenaga Kerja Langsung",
      indirect_material: "Bahan Baku Tidak Langsung",
      overhead: "Biaya Overhead",
      other: "Lainnya",
    };

    return typeMap[value] || value;
  };

  const columns = [
    {
      accessor: "rowNumber",
      name: "No",
      sortable: false,
    },
    {
      accessor: "name",
      name: "Nama Komponen",
      sortable: true,
      filterable: true,
    },
    {
      accessor: "component_type",
      name: "Tipe Komponen",
      sortable: true,
      filterable: true,
      cell: (row) => formatComponentType(row.component_type),
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

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);

    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/api/cost-components`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set data from response
        setData(response.data.data || []);
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
      fetch();
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
  return (
    <>
      <Header>
        <CreateComponent
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
        <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
          Tambah Komponen
        </Button>
      </Header>
      <Card className="space-y-4 gap-2">
        <DataTable
          data={data}
          columns={columns}
          pagination={true}
          filterable={true}
        />
        <DetailComponent
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          id={selectedId}
        />
        <EditComponent
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          id={selectedId}
        />
        <DeleteComponentModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          id={selectedId}
          onDeleted={handleDeleted}
        />
      </Card>
    </>
  );
};
export default CostComponent;
