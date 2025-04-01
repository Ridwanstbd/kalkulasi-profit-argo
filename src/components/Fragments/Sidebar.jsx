import React, { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../Elements/Button";
import { useEffect } from "react";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const auth = useAuth();
  const { user, logout: authLogout } = auth || {};
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Run once on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: <Home size={18} />,
      link: "/dashboard/me",
    },
  ];
  const userMenuItems = [];
  const menuItems = user?.is_admin ? adminMenuItems : userMenuItems;

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <header className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <h2 className="font-bold text-xl">Profiting UMKM</h2>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <Menu size={24} />
        </button>
      </header>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-opacity-10 z-20"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`fixed md:sticky top-0 left-0 h-full md:h-screen bg-gray-800 text-white z-30 
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"} 
          md:translate-x-0 ${
            isCollapsed ? "md:w-16" : "md:w-64"
          } md:flex-shrink-0`}
      >
        <div
          className={`p-4 border-b border-gray-700 flex ${
            isCollapsed ? "justify-center" : "justify-between"
          } items-center`}
        >
          {!isCollapsed && (
            <h2 className="font-bold text-xl">Profiting UMKM</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col justify-between h-[calc(100%-64px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index} className="relative">
                  {item.submenu ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleSubmenu(index)}
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          {item.icon && (
                            <span className={isCollapsed ? "" : "mr-3"}>
                              {item.icon}
                            </span>
                          )}
                          {!isCollapsed && <span>{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              activeMenu === index ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {!isCollapsed && (
                        <ul
                          className={`ml-6 space-y-1 transition-all duration-200 ease-in-out overflow-hidden
                                  ${
                                    activeMenu === index
                                      ? "max-h-96"
                                      : "max-h-0"
                                  }`}
                        >
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <a
                                href={subItem.link}
                                className="block p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                              >
                                {subItem.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.link}
                      className={`flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                      title={isCollapsed ? item.title : ""}
                    >
                      {item.icon && (
                        <span className={isCollapsed ? "" : "mr-3"}>
                          {item.icon}
                        </span>
                      )}
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-2 mt-auto">
            {!isCollapsed && (
              <h2 className="font-bold text-xl mb-2">{user?.name || "User"}</h2>
            )}
            {isCollapsed ? (
              <Button
                onClick={handleLogout}
                style="flex justify-center items-center rounded-md hover:bg-red-700 transition-colors text-white bg-red-600 "
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                style="flex items-center p-2 rounded-md hover:bg-red-700 transition-colors text-white bg-red-600 w-full"
              >
                <LogOut size={18} className="mr-3" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-5 bg-gray-800 text-white p-1 rounded-full border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <main className="flex-1 p-4 md:px-6 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
export default Sidebar;
