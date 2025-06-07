import { useEffect, useState } from "react";
import Widget from "../../../components/Elements/Widget/Widget";
import Header from "../../../components/Fragments/Header";
import { apiBaseUrl } from "../../../config/api";
import { useAuth } from "../../../contexts/AuthContext";
import DataTable from "../../../components/Fragments/DataTable";
import TableActions from "../../../components/Elements/TableActions";
import Loading from "../../../components/Elements/Loading";
import axios from "axios";
import Card from "../../../components/Elements/Card";
import { useOutletContext } from "react-router-dom";
import useDocumentHead from "../../../hooks/useDocumentHead";
import Button from "../../../components/Elements/Button";
import SelectForm from "../../../components/Elements/Select";
import Label from "../../../components/Elements/Input/Label";
import CreateSales from "./partials/create";
import DetailSalesModal from "./partials/detail";
import EditSalesModal from "./partials/edit";
import DeleteSalesModal from "./partials/delete";

const SalesRecap = () => {
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

  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const pageInfo = {
    title: "Rekapitulasi Penjualan Saya",
    description:
      "Halaman ini untuk mengelola Rekap Penjualan yang kamu butuhkan, mulai dari membuat mengubah dan menghapus",
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

  const [summary, setSummary] = useState({
    total_sales: 0,
    total_profit: 0,
    total_profit_percentage: 0,
  });

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);
    const fetchData = async (year = null, month = null) => {
      try {
        setLoading(true);
        let url = `${apiBaseUrl}/api/sales`;

        const params = new URLSearchParams();
        if (year) params.append("year", year);
        if (month) params.append("month", month);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.data || []);
        setSummary(response.data.summary || {});

        if (response.data.filters) {
          setAvailableYears(response.data.filters.available_years || []);
          setAvailableMonths(response.data.filters.available_months || []);

          if (!selectedYear && response.data.filters.current_year) {
            setSelectedYear(response.data.filters.current_year);
          }
          if (!selectedMonth && response.data.filters.current_month) {
            setSelectedMonth(response.data.filters.current_month);
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
      fetchData(selectedYear, selectedMonth);
    }

    const fetchDataRef = {
      current: fetchData,
    };

    const handleFetchData = (year = null, month = null) => {
      fetchDataRef.current(year, month);
    };
    SalesRecap.fetchData = handleFetchData;

    return () => {
      SalesRecap.fetchData = undefined;
    };
  }, [
    setPageTitle,
    setPageDescription,
    pageInfo.title,
    pageInfo.description,
    token,
    showAlert,
    selectedYear,
    selectedMonth,
  ]);

  const handleYearChange = (e) => {
    const year = e.target.value ? parseInt(e.target.value) : null;
    setSelectedYear(year);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value ? parseInt(e.target.value) : null;
    setSelectedMonth(month);
  };

  const handleResetFilters = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

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

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "0%";
    }
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return `${numValue.toFixed(2)}%`;
  };
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const columns = [
    {
      accessor: "rowNumber",
      name: "No",
      sortable: false,
    },
    {
      accessor: "name",
      name: "Nama Klien",
      sortable: true,
      filterable: true,
    },
    {
      accessor: "service_name",
      name: "Nama Layanan",
      sortable: true,
      filterable: true,
      cell: (row) => `${row.service_name} - ${row.service_sku}`,
    },
    {
      accessor: "date",
      name: "Tanggal",
      sortable: true,
      filterable: true,
    },
    {
      accessor: "profit",
      name: "Keuntungan",
      sortable: true,
      filterable: true,
      cell: (row) => {
        return (
          <div className="text-right font-medium">
            {formatCurrency(row.profit)}
          </div>
        );
      },
    },
    {
      key: "button-actions",
      name: "Aksi",
      sortable: false,
      filterable: false,
      cell: (row) => (
        <TableActions
          row={row}
          onDetail={() => handleDetail(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          size="md"
        />
      ),
    },
  ];

  return (
    <>
      <Header>
        <Widget
          title="Penjualan"
          count={formatCurrency(summary.total_sales)}
          status="Jumlah"
          description="Jumlah Penjualan"
        />
        <Widget
          title="Keuntungan"
          count={formatCurrency(summary.total_profit)}
          status="Jumlah"
          description="Jumlah keuntungan"
        />
        <Widget
          title="Keuntungan"
          count={formatPercentage(summary.total_profit_percentage)}
          status="Persentase"
          description="Persentase Keuntungan"
        />

        <SelectForm
          label="Tahun"
          name="year"
          value={selectedYear || ""}
          onChange={handleYearChange}
          options={[
            { value: "", label: "Semua Tahun" },
            ...availableYears.map((year) => ({
              value: year,
              label: year.toString(),
            })),
          ]}
          ariaLabel="Pilih tahun"
        />
        <SelectForm
          label="Bulan"
          name="month"
          value={selectedMonth || ""}
          onChange={handleMonthChange}
          options={[
            { value: "", label: "Semua Bulan" },
            ...availableMonths.map((month) => ({
              value: month,
              label: monthNames[month - 1],
            })),
          ]}
          ariaLabel="Pilih bulan"
        />

        <div>
          <Label htmlFor="reset">Aksi</Label>
          <Button
            onClick={handleResetFilters}
            variant="secondary"
            className="mb-0 w-full"
            id="reset"
          >
            Setel Ulang
          </Button>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
          Tambah Rekap
        </Button>
        <CreateSales
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Header>
      <Card>
        <DataTable
          data={data}
          columns={columns}
          sortable={true}
          filterable={true}
        />
        <DetailSalesModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          sales_id={selectedId}
        />
        <EditSalesModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          sales_id={selectedId}
        />
        <DeleteSalesModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          sales_id={selectedId}
          onDeleted={handleDeleted}
        />
      </Card>
    </>
  );
};
export default SalesRecap;
