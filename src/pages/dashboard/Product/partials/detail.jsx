import React, { useEffect } from "react";
import Modal from "../../../../components/Fragments/Modal";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../../../config/api";
import Loading from "../../../../components/Elements/Loading";
import InputForm from "../../../../components/Elements/Input";
import DataTable from "../../../../components/Fragments/DataTable";

const DetailServiceModal = ({ isOpen, onClose, service_id }) => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState({
    name: "",
    sku: "",
    hpp: "",
    selling_price: "",
    description: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      if (!service_id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/services/${service_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setServiceData(response.data.data);

          if (response.data.hpp_breakdown) {
            const breakdownData = [
              {
                id: 1,
                category: "Bahan Langsung",
                amount: response.data.hpp_breakdown.direct_material.amount,
                percentage:
                  response.data.hpp_breakdown.direct_material.percentage,
              },
              {
                id: 2,
                category: "Tenaga Kerja Langsung",
                amount: response.data.hpp_breakdown.direct_labor.amount,
                percentage: response.data.hpp_breakdown.direct_labor.percentage,
              },
              {
                id: 3,
                category: "Overhead",
                amount: response.data.hpp_breakdown.overhead.amount,
                percentage: response.data.hpp_breakdown.overhead.percentage,
              },
              {
                id: 4,
                category: "Packaging",
                amount: response.data.hpp_breakdown.packaging.amount,
                percentage: response.data.hpp_breakdown.packaging.percentage,
              },
              {
                id: 5,
                category: "Lain-lain",
                amount: response.data.hpp_breakdown.other.amount,
                percentage: response.data.hpp_breakdown.other.percentage,
              },
              {
                id: 6,
                category: "Total HPP",
                amount: response.data.hpp_breakdown.total,
                percentage: 100,
              },
            ];
            setData(breakdownData);
          }
        }
      } catch (error) {
        console.error("Error fetching Service details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && token && service_id) {
      fetchService();
    }
  }, [token, service_id, isOpen]);

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return "";
    return `${value}%`;
  };

  const handleNoOpChange = () => {};

  const columns = [
    { accessor: "category", name: "Kategori Biaya", sortable: true },
    {
      accessor: "amount",
      name: "Jumlah",
      sortable: true,
      cell: (row) => formatCurrency(row.amount),
    },
    {
      accessor: "percentage",
      name: "Persentase",
      sortable: true,
      cell: (row) => formatPercentage(row.percentage),
    },
  ];

  return (
    <Modal
      id="modal-detail-service"
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Layanan"
      size="large"
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputForm
              label="Nama Layanan"
              name="name"
              type="text"
              placeholder="Dress A"
              value={serviceData.name}
              onChange={handleNoOpChange}
              readOnly={true}
            />
            <InputForm
              label="Kode Layanan"
              name="sku"
              type="text"
              placeholder="A0001"
              value={serviceData.sku}
              onChange={handleNoOpChange}
              readOnly={true}
            />
            <InputForm
              label="Harga Pokok Layanan"
              name="hpp"
              type="text"
              value={formatCurrency(serviceData.hpp)}
              onChange={handleNoOpChange}
              readOnly={true}
            />
            <InputForm
              label="Harga Jual Layanan"
              name="selling_price"
              type="text"
              value={formatCurrency(serviceData.selling_price)}
              onChange={handleNoOpChange}
              readOnly={true}
            />
            <InputForm
              label="Deskripsi Layanan"
              name="description"
              type="textarea"
              placeholder="(tidak ada deskripsi)"
              value={serviceData.description}
              onChange={handleNoOpChange}
              readOnly={true}
            />
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-3">
            Rincian Harga Pokok Layanan (HPP)
          </h2>
          <DataTable data={data} columns={columns} pagination={false} />
        </>
      )}
    </Modal>
  );
};

export default DetailServiceModal;
