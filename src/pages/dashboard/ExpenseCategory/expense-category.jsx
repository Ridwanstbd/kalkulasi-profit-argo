import { useEffect, useState } from "react";
import useDocumentHead from "../../../hooks/useDocumentHead";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import { apiBaseUrl } from "../../../config/api";
import Loading from "../../../components/Elements/Loading";
import Header from "../../../components/Fragments/Header";
import Button from "../../../components/Elements/Button";
import DataTable from "../../../components/Fragments/DataTable";
import Card from "../../../components/Elements/Card";
import TableActions from "../../../components/Elements/TableActions";
import CreateCategory from "./partials/create";
import DetailCategoryModal from "./partials/detail";
import EditCategoryModal from "./partials/edit";
import DeleteCategoryModal from "./partials/delete";

const ExpenseCategory = () => {
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
    title: "Kategori Biaya Tetap Saya",
    description:
      "Halaman ini untuk mengelola Kategori Biaya Tetap yang kamu butuhkan, mulai dari membuat mengubah dan menghapus",
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
    showAlert("Kategori berhasil dihapus", "success");
  };

  const columns = [
    {
      accessor: "rowNumber",
      name: "No",
      sortable: false,
    },
    {
      accessor: "name",
      name: "Nama Kategori",
      sortable: true,
      filterable: true,
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
        const response = await axios.get(
          `${apiBaseUrl}/api/expense-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
        <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
          Tambah Kategori
        </Button>
        <CreateCategory
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
        <DetailCategoryModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          category_id={selectedId}
        />
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category_id={selectedId}
        />
        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          category_id={selectedId}
          onDeleted={handleDeleted}
        />
      </Card>
    </>
  );
};
export default ExpenseCategory;
