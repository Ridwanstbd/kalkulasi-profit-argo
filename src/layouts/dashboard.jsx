/* eslint-disable react-refresh/only-export-components */
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Fragments/Sidebar";
import { createContext, useState } from "react";
import Alert from "../components/Elements/Alert";

export const AlertContext = createContext();
const Dashboard = () => {
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "info", // error, warning, info, success
  });

  const showAlert = (message, type = "info") => {
    hideAlert();
    setAlert({
      visible: true,
      message,
      type,
    });
    setTimeout(() => {
      hideAlert();
    }, 2000);
  };
  const hideAlert = () => {
    setAlert((prev) => ({
      ...prev,
      visible: false,
    }));
  };
  return (
    <AlertContext.Provider value={{ showAlert }}>
      <Sidebar title={pageTitle}>
        <Outlet context={{ setPageTitle, showAlert }} />
        <div className="absolute right-3 top-16 z-50 w-80 overflow-hidden">
          {alert.visible && (
            <div className="transform transition-transform duration-300 ease-out">
              <Alert
                message={alert.message}
                type={alert.type}
                dismissible={true}
                onDismiss={hideAlert}
                className="shadow-lg"
              />
            </div>
          )}
        </div>
      </Sidebar>
    </AlertContext.Provider>
  );
};
export default Dashboard;
