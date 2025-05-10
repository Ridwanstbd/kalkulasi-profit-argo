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
import Widget from "../../../components/Elements/Widget/Widget";
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
  const [summary, setSummary] = useState({
    total_salary: 0,
    total_operational: 0,
    grand_total: 0,
  });

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
          `${apiBaseUrl}/v1/expense-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data.data || []);
        setSummary(response.data.summary || []);
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
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Header>
        <Widget
          title="Gaji"
          count={formatCurrency(summary.total_salary)}
          status="Jumlah"
          description="jumlah gaji karyawan"
        />
        <Widget
          title="Biaya Tetap"
          count={formatCurrency(summary.total_operational)}
          status="Jumlah"
          description="jumlah biaya selain gaji"
        />
        <Widget
          title="Total"
          count={formatCurrency(summary.grand_total)}
          status="Jumlah"
          description="jumlah biaya operasional tetap"
        />
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
