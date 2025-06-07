import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home,
  PanelLeftOpen,
  PanelLeftClose,
  User,
  CircleUserRound,
  DollarSign,
  BanknoteArrowDown,
  FlaskConical,
  BookMarked,
  Package,
  CircleDollarSign,
  Blocks,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Dropdown from "../Elements/Dropdown";
import Button from "../Elements/Button";

const Sidebar = ({ title, description, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const auth = useAuth();
  const { logout: authLogout } = auth || {};
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    setCurrentDateTime(new Date());
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format hari dalam Bahasa Indonesia
  const getDayName = () => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[currentDateTime.getDay()];
  };

  // Format tanggal dalam Bahasa Indonesia
  const getFormattedDate = () => {
    const day = currentDateTime.getDate();
    const month = currentDateTime.getMonth();
    const year = currentDateTime.getFullYear();

    const months = [
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

    return `${day} ${months[month]} ${year}`;
  };

  const getFormattedTime = () => {
    const hours = currentDateTime.getHours().toString().padStart(2, "0");
    const minutes = currentDateTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const hasActiveSubmenu = (submenu) => {
    return submenu && submenu.some((item) => location.pathname === item.link);
  };

  const commonMenuItems = [
    {
      title: "Dashboard",
      icon: <Home />,
      link: "/dashboard",
    },
    {
      title: "Kalkulasi Biaya Layanan",
      icon: <FlaskConical />,
      link: "/dashboard/service-cost",
    },
    {
      title: "Skema Harga Retail",
      icon: <DollarSign />,
      link: "/dashboard/pricing",
    },
    {
      title: "Biaya Operasional Tetap",
      icon: <BanknoteArrowDown />,
      link: "/dashboard/operational-expenses",
    },
    {
      title: "Rekap Penjualan",
      icon: <BookMarked />,
      link: "/dashboard/sales-recap",
    },
  ];

  const masterDataMenuItems = [
    {
      title: "Daftar Layanan",
      icon: <Package />,
      link: "/dashboard/services",
    },
    {
      title: "Kategori Biaya Tetap",
      icon: <Blocks />,
      link: "/dashboard/expense-categories",
    },
    {
      title: "Daftar Komponen Biaya",
      icon: <CircleDollarSign />,
      link: "/dashboard/cost-components",
    },
  ];

  const menuCategories = [
    {
      category: "Master Data",
      items: masterDataMenuItems,
    },
    {
      category: "Fitur Utama",
      items: commonMenuItems,
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleLogout = () => {
    authLogout();
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <h2 className="font-bold text-xl">Kalkulasi Profit</h2>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <Menu size={24} />
        </button>
      </header>

      <div className="flex flex-1">
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-opacity-10 z-20"
            onClick={toggleSidebar}
          />
        )}

        <div
          className={`fixed md:sticky top-0 left-0 h-full md:h-screen bg-gray-800 text-white z-30 
            transition-all duration-300 ease-in-out flex flex-col
            ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"} 
            md:translate-x-0 ${
              isCollapsed ? "md:w-16" : "md:w-64"
            } md:flex-shrink-0`}
        >
          <div
            className={`p-4 flex ${
              isCollapsed
                ? "justify-center"
                : "justify-between border-b border-gray-700 "
            } items-center`}
          >
            {!isCollapsed && (
              <h2 className="font-bold text-xl">Kalkulasi Profit</h2>
            )}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col flex-grow overflow-hidden">
            <nav
              className={`p-4 flex-grow overflow-y-auto ${
                isCollapsed
                  ? "overflow-hidden"
                  : "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300"
              }`}
            >
              {menuCategories.map(
                (category, categoryIndex) =>
                  category.items.length > 0 && (
                    <div key={categoryIndex} className="mb-6">
                      {!isCollapsed && (
                        <div className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {category.category}
                        </div>
                      )}
                      {isCollapsed && categoryIndex > 0 && (
                        <div className="border-t border-gray-700 my-4"></div>
                      )}

                      <ul className="space-y-2">
                        {category.items.map((item, index) => {
                          const isActive = isActivePath(item.link);
                          const hasActiveSubitem = hasActiveSubmenu(
                            item.submenu
                          );
                          const isSubmenuOpen =
                            activeMenu === `${categoryIndex}-${index}`;

                          return (
                            <li key={index} className="relative">
                              {item.submenu ? (
                                <div className="space-y-2">
                                  <button
                                    onClick={() =>
                                      toggleSubmenu(`${categoryIndex}-${index}`)
                                    }
                                    className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 ${
                                      hasActiveSubitem || isSubmenuOpen
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "hover:bg-gray-700 text-gray-300 hover:text-white"
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {item.icon && (
                                        <span
                                          className={`${
                                            isCollapsed ? "" : "mr-3"
                                          } ${
                                            hasActiveSubitem || isSubmenuOpen
                                              ? "text-white"
                                              : ""
                                          }`}
                                        >
                                          {item.icon}
                                        </span>
                                      )}
                                      {!isCollapsed && (
                                        <span>{item.title}</span>
                                      )}
                                    </div>
                                    {!isCollapsed && (
                                      <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${
                                          isSubmenuOpen ? "rotate-180" : ""
                                        } ${
                                          hasActiveSubitem || isSubmenuOpen
                                            ? "text-white"
                                            : ""
                                        }`}
                                      />
                                    )}
                                  </button>

                                  {!isCollapsed && (
                                    <ul
                                      className={`ml-6 space-y-1 transition-all duration-200 ease-in-out overflow-hidden
                                          ${
                                            isSubmenuOpen
                                              ? "max-h-96"
                                              : "max-h-0"
                                          }`}
                                    >
                                      {item.submenu.map((subItem, subIndex) => {
                                        const isSubActive = isActivePath(
                                          subItem.link
                                        );
                                        return (
                                          <li key={subIndex}>
                                            <a
                                              href={subItem.link}
                                              className={`block p-2 rounded-md transition-all duration-200 ${
                                                isSubActive
                                                  ? "bg-blue-500 text-white font-medium shadow-sm border-l-4 border-blue-300"
                                                  : "text-gray-300 hover:text-white hover:bg-gray-700"
                                              }`}
                                            >
                                              {subItem.title}
                                            </a>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </div>
                              ) : (
                                <Link
                                  to={item.link}
                                  className={`flex items-center p-2 rounded-md transition-all duration-200 relative ${
                                    isCollapsed ? "justify-center" : ""
                                  } ${
                                    isActive
                                      ? "bg-blue-600 text-white font-medium shadow-md border-l-4 border-blue-300"
                                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                                  }`}
                                  title={isCollapsed ? item.title : ""}
                                >
                                  {item.icon && (
                                    <span
                                      className={`${
                                        isCollapsed ? "" : "mr-3"
                                      } ${isActive ? "text-white" : ""}`}
                                    >
                                      {item.icon}
                                    </span>
                                  )}
                                  {!isCollapsed && <span>{item.title}</span>}
                                  {/* Active indicator dot for collapsed sidebar */}
                                  {isCollapsed && isActive && (
                                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                                  )}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )
              )}
            </nav>

            <div className="p-2">
              <button
                onClick={toggleCollapse}
                className="hidden md:flex absolute right-4.5 top-4 cursor-pointer"
              >
                {isCollapsed ? (
                  <PanelLeftOpen size={27} />
                ) : (
                  <PanelLeftClose size={27} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <header className="flex flex-col sm:flex-row bg-white text-gray-800 py-1.5 px-3 sm:px-6 shadow-sm items-center justify-between gap-2 sm:gap-0">
            {/* Menampilkan waktu dan hari */}
            <div className="flex items-center w-full max-w-[280px] sm:max-w-none mx-auto sm:mx-0 sm:w-auto justify-center sm:justify-start">
              <p className="font-bold text-sm sm:text-base md:text-lg truncate">
                {getDayName()}, {getFormattedDate()} | {getFormattedTime()}
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end w-full max-w-[280px] sm:max-w-none mx-auto sm:mx-0 sm:w-auto">
              <Dropdown
                trigger={
                  <Button className="flex gap-1 sm:gap-2 items-center rounded-md p-1 sm:p-2">
                    <CircleUserRound
                      size={22}
                      className="sm:w-6 sm:h-6 md:w-8 md:h-8"
                    />
                    <span className="text-xs sm:text-sm md:text-md">
                      Akun Saya
                    </span>
                  </Button>
                }
                position="bottom-right"
              >
                <Dropdown.Item
                  icon={<User size={18} />}
                  onClick={() => navigate("/dashboard/me")}
                >
                  Profil
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  icon={<LogOut size={18} />}
                  onClick={handleLogout}
                >
                  Keluar
                </Dropdown.Item>
              </Dropdown>
            </div>
          </header>

          <main className="flex-1 p-4 md:px-6 w-full overflow-x-hidden">
            <div className="my-4">
              <h2 className="font-bold text-xl">{title}</h2>
              <h2 className="text-md">{description}</h2>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
