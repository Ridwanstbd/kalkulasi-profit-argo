import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiBaseUrl } from "../../../config/api";
import { useAuth } from "../../../contexts/AuthContext";
import Widget from "../../../components/Elements/Widget/Widget";
import CreateProductModal from "./partials/create";
import useDocumentHead from "../../../hooks/useDocumentHead";
import DataTable from "../../../components/Fragments/DataTable";
import TableActions from "../../../components/Elements/TableActions";
import Card from "../../../components/Elements/Card";
import Loading from "../../../components/Elements/Loading";
import axios from "axios";
import DetailProductModal from "./partials/detail";
import EditProductModal from "./partials/edit";
import DeleteProductModal from "./partials/delete";
import Header from "../../../components/Fragments/Header";

const Product = () => {
  const { setPageTitle, setPageDescription } = useOutletContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showAlert } = useOutletContext();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    total_products: 0,
    avg_selling_price: 0,
    avg_hpp: 0,
    total_selling_value: 0,
    total_hpp_value: 0,
    profit_margin: 0,
  });
  const pageInfo = {
    title: "Produk Saya",
    description:
      "Halaman ini untuk mengelola produk yang kamu butuhkan, mulai dari membuat mengubah dan menghapus",
  };
  useDocumentHead(pageInfo);

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/v1/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set data from response
        setData(response.data.data || []);

        // Set stats from response if available
        if (response.data.stats) {
          setStats(response.data.stats);
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
      fetchProducts();
    }
  }, [
    setPageTitle,
    setPageDescription,
    pageInfo.title,
    pageInfo.description,
    token,
    showAlert,
  ]);

  // Handler untuk aksi
  const handleDetail = (row) => {
    setSelectedProductId(row.id);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedProductId(row.id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedProductId(row.id);
    setIsDeleteModalOpen(true);
  };

  // Handler untuk update setelah produk dihapus
  const handleProductDeleted = (deletedProductId) => {
    setData(data.filter((item) => item.id !== deletedProductId));
    showAlert("Produk berhasil dihapus", "success");

    // Update stats after deletion
    setStats({
      ...stats,
      total_products: stats.total_products - 1,
    });
  };

  // Definisi kolom untuk tabel
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
      name: "Stock Keeping Unit",
      sortable: true,
      filterable: true,
    },
    {
      accessor: "hpp",
      name: "Harga Pokok Produksi",
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

  // Format currency values
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
          title="Produk"
          count={stats.total_products}
          status="Jumlah"
          description="jumlah produk tersimpan"
        />
        <Widget
          title="Harga Retail"
          count={formatCurrency(stats.avg_selling_price)}
          status="Rata-rata"
          description="harga retail produk"
        />
        <Widget
          title="Harga Pokok Produk"
          count={formatCurrency(stats.avg_hpp)}
          status="Rata-rata"
          description="harga pokok produk"
        />
        <Widget
          title="Harga Pokok Produk"
          count={formatCurrency(stats.total_hpp_value)}
          status="Total"
          description="harga pokok produk"
        />
        <Widget
          title="Margin Produk"
          count={formatCurrency(stats.profit_margin)}
          status="Total"
          description="margin produk"
        />
        <Widget
          showActionCard={true}
          actionButtonText="Tambah Produk"
          actionDescription="Buat Produk Baru"
          onAction={() => setIsAddModalOpen(true)}
          imageUrl="../../../../public/img/illustrations/create-illustration.jpg"
        />
        <CreateProductModal
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
        <DetailProductModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          product_id={selectedProductId}
        />
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product_id={selectedProductId}
        />
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          product_id={selectedProductId}
          onProductDeleted={handleProductDeleted}
        />
      </Card>
    </>
  );
};
export default Product;
