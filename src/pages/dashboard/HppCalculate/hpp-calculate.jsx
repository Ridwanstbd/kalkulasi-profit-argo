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

const HppCalculate = () => {
  const { setPageTitle, setPageDescription } = useOutletContext();
  //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  //   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  //   const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showAlert } = useOutletContext();
  const [data, setData] = useState([]);

  const pageInfo = {
    title: "Harga Pokok Produk Saya",
    description:
      "Halaman ini untuk mengelola harga pokok produk yang kamu butuhkan, mulai dari membuat mengubah dan menghapus",
  };
  useDocumentHead(pageInfo);

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/v1/hpp`, {
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
      accessor: "name",
      name: "nama",
      sortable: true,
      filterable: true,
    },
    { accessor: "sku", name: "sku", sortable: true, filterable: true },
    {
      accessor: "hpp",
      name: "hpp",
      sortable: true,
      filterable: true,
    },
  ];
  return (
    <>
      <Header></Header>
      <Card className="space-y-4 gap-2">
        <DataTable
          data={data}
          columns={columns}
          pagination={true}
          filterable={true}
        />
      </Card>
    </>
  );
};
export default HppCalculate;
