import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiBaseUrl } from "../../config/api";
import ReactApexChart from "react-apexcharts";
import Loading from "../../components/Elements/Loading";
import Header from "../../components/Fragments/Header";
import Widget from "../../components/Elements/Widget/Widget";
import SelectForm from "../../components/Elements/Select";
import Card from "../../components/Elements/Card";
import useDocumentHead from "../../hooks/useDocumentHead";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const { setPageTitle, setPageDescription } = useOutletContext();
  const { token } = useAuth();
  const [data, setData] = useState({
    total_sales: 0,
    total_cost: 0,
    total_variable_cost: 0,
    total_operational_cost: 0,
    total_salary_expenses: 0,
    gross_profit: 0,
    net_profit: 0,
  });
  const [chartData, setChartData] = useState({
    series: [],
    loading: true,
    error: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const pageInfo = {
    title: "Dashboard",
    description: "Halaman ini untuk melihat dasbor bisnis kamu.",
  };
  useDocumentHead(pageInfo);

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);
    const fetchSummaryData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        let url = `${apiBaseUrl}/api/stats`;

        const params = new URLSearchParams();
        if (selectedYear) params.append("year", selectedYear);
        if (selectedMonth) params.append("month", selectedMonth);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!responseData.success) {
          throw new Error(responseData.message || "Failed to fetch data");
        }

        const statsData = responseData.data || {};

        setData(statsData);

        if (statsData.availableYears && statsData.availableYears.length > 0) {
          setAvailableYears(statsData.availableYears);
          if (!selectedYear) {
            setSelectedYear(statsData.availableYears[0]);
          }
        }

        if (statsData.availableMonths) {
          setAvailableMonths(statsData.availableMonths);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching summary data:", err);
        setError("Failed to load financial summary data: " + err.message);
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [
    pageInfo.description,
    pageInfo.title,
    selectedMonth,
    selectedYear,
    setPageDescription,
    setPageTitle,
    token,
  ]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!selectedYear || !token) return;

      try {
        setChartData((prev) => ({ ...prev, loading: true, error: null }));

        let monthlyData = [];
        let hasError = false;
        let errorMessage = "";

        const fetchPromises = Array.from({ length: 12 }, (_, i) => i + 1).map(
          async (month) => {
            try {
              const url = `${apiBaseUrl}/api/stats?year=${selectedYear}&month=${month}`;

              const response = await fetch(url, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                console.warn(
                  `Failed to fetch data for month ${month}: HTTP ${response.status}`
                );
                return { month, error: true };
              }

              const data = await response.json();
              if (!data.success) {
                console.warn(
                  `API returned error for month ${month}: ${
                    data.message || "Unknown error"
                  }`
                );
                return { month, error: true };
              }

              return {
                month,
                ...data.data,
                error: false,
              };
            } catch (err) {
              console.warn(`Exception when fetching month ${month}:`, err);
              return { month, error: true };
            }
          }
        );

        const results = await Promise.all(fetchPromises);

        monthlyData = results.map((result) => {
          if (result.error) {
            return {
              month: result.month,
              total_sales: 0,
              total_cost: 0,
              total_variable_cost: 0,
              total_operational_cost: 0,
              total_salary_expenses: 0,
              gross_profit: 0,
              net_profit: 0,
            };
          }
          return result;
        });

        monthlyData.sort((a, b) => a.month - b.month);

        const hasAnyValidData = monthlyData.some(
          (item) =>
            !item.error &&
            (item.total_sales > 0 ||
              item.total_cost > 0 ||
              item.total_variable_cost > 0 ||
              item.total_operational_cost > 0 ||
              item.total_salary_expenses > 0)
        );

        if (!hasAnyValidData) {
          console.warn("No valid data found for any month");
        }

        const transformedData = [
          {
            name: "Total Penjualan",
            data: monthlyData.map((item) => item.total_sales || 0),
          },
          {
            name: "Total Biaya",
            data: monthlyData.map((item) => item.total_cost || 0),
          },
          {
            name: "Biaya Variabel",
            data: monthlyData.map((item) => item.total_variable_cost || 0),
          },
          {
            name: "Biaya Operasional",
            data: monthlyData.map((item) => item.total_operational_cost || 0),
          },
          {
            name: "Biaya Gaji",
            data: monthlyData.map((item) => item.total_salary_expenses || 0),
          },
        ];

        setChartData({
          series: transformedData,
          loading: false,
          error: hasError ? errorMessage : null,
        });
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setChartData({
          series: [],
          loading: false,
          error: "Failed to load chart data: " + err.message,
        });
      }
    };

    fetchMonthlyData();
  }, [selectedYear, token]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const chartOptions = {
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ["#008FFB", "#FF4560", "#FEB019", "#00E396", "#775DD0"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    title: {
      text: `Statistik Keuangan tahun ${
        selectedYear || new Date().getFullYear()
      }`,
      align: "left",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
      title: {
        text: "Bulan",
      },
    },
    yaxis: {
      title: {
        text: "Jumlah",
      },
      labels: {
        formatter: function (value) {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            notation: "compact",
            compactDisplay: "short",
          }).format(value);
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(value);
        },
      },
    },
    noData: {
      text: "Tidak ada data",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#888",
        fontSize: "16px",
        fontFamily: "Helvetica",
      },
    },
  };

  useEffect(() => {
    if (selectedYear && chartData.series.length > 0 && !chartData.loading) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  }, [selectedYear, chartData]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setSelectedMonth(null);
    setChartData({
      series: [],
      loading: true,
      error: null,
    });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
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
  if (loading && !data.total_sales) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Header>
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
      </Header>
      <Header>
        <Widget
          title="Penjualan"
          count={formatCurrency(data.total_sales || 0)}
          status="Jumlah"
          description="Jumlah Penjualan"
        />
        <Widget
          title="Biaya"
          count={formatCurrency(data.total_cost || 0)}
          status="Jumlah"
          description="Jumlah Biaya"
        />
        <Widget
          title="Keuntungan Kotor"
          count={formatCurrency(data.gross_profit || 0)}
          status="Jumlah"
          description="Jumlah Keuntungan Kotor"
        />
        <Widget
          title="Keuntungan Bersih"
          count={formatCurrency(data.net_profit || 0)}
          status="Jumlah"
          description="Jumlah Keuntungan Bersih"
        />
      </Header>

      {selectedYear && (
        <Card className="max-w-4xl">
          {chartData.loading ? (
            <Loading />
          ) : chartData.error ? (
            <div className="text-center py-16 text-red-500">
              {chartData.error}
            </div>
          ) : chartData.series.length > 0 ? (
            <ReactApexChart
              options={chartOptions}
              series={chartData.series}
              type="line"
              height={350}
            />
          ) : (
            <div className="text-center py-16 text-gray-500">
              Tidak ada data bulanan untuk {selectedYear}
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default Dashboard;
