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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showAlert } = useOutletContext();
  const [data, setData] = useState([]);

  const [options, setOptions] = useState({
    product: [],
  });
  const [productHPP, setProductHPP] = useState("-");

  const pageInfo = {
    title: "Skema Harga Saya",
    description:
      "Halaman ini untuk mengelola Skema Harga yang kamu butuhkan untuk membagi Margin Produk kamu ke distributor, reseller sampai affiliator. kamu bisa mulai dari membuat skema mengubah dan menghapus",
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

  const handleProductChange = async (selectedOptions) => {
    const newSelectedProduct =
      selectedOptions && selectedOptions.length > 0 ? selectedOptions[0] : null;

    setSelectedProduct(newSelectedProduct);

    if (newSelectedProduct) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/v1/price-schemes?product_id=${newSelectedProduct.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const processedData = (response.data.data || []).map((item) => ({
          ...item,
          product_name: item.product?.name || "-",
          product_sku: item.product?.sku || "-",
        }));

        setData(processedData);

        const productResponse = await axios.get(
          `${apiBaseUrl}/v1/products/${newSelectedProduct.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (productResponse.data?.data) {
          setProductHPP(productResponse.data.data.hpp || "-");
        } else {
          setProductHPP("-");
        }
      } catch (error) {
        console.error("Error fetching product HPP:", error);
        showAlert("Gagal memuat ulang data produk", "error");
        setProductHPP("-");
      } finally {
        setLoading(false);
      }
    } else {
      setData(data);
      setProductHPP("-");
    }
  };

  const handleOpenModal = () => {
    if (!selectedProduct) {
      showAlert("Silakan pilih produk terlebih dahulu", "warning");
      return;
    }
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/v1/price-schemes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const processedData = (response.data.data || []).map((item) => ({
          ...item,
          product_name: item.product?.name || "-",
          product_sku: item.product?.sku || "-",
        }));

        setData(processedData);
        if (
          response.data.all_products &&
          Array.isArray(response.data.all_products)
        ) {
          const productOptions = response.data.all_products.map((product) => ({
            value: product.id,
            label: `${product.name} (${product.sku})`,
          }));

          setOptions((prev) => ({
            ...prev,
            product: productOptions,
          }));

          if (productOptions.length > 0 && response.data.product) {
            const defaultProduct = {
              value: response.data.product.id,
              label: `${response.data.product.name} (${response.data.product.sku})`,
            };
            setSelectedProduct(defaultProduct);

            const filteredData = processedData.filter(
              (item) => item.product_id === defaultProduct.value
            );
            setData(filteredData);

            if (response.data.product.hpp) {
              setProductHPP(response.data.product.hpp);
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
          name="product_id"
          value={selectedProduct ? [selectedProduct] : []}
          onChange={handleProductChange}
          options={options.product}
          placeholder="Pilih produk"
        />
        <div>
          <Label htmlFor="hpp">HPP</Label>
          <h3 className="font-bold text-xl">
            {productHPP !== "-"
              ? `Rp ${parseFloat(productHPP).toLocaleString("id-ID")}`
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
          {isAddModalOpen && selectedProduct && (
            <CreatePricingModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              product_id={selectedProduct.value}
              product_name={selectedProduct.label}
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
