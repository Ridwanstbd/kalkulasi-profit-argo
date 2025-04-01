import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const location = useLocation();

  const checkAuthFromStorage = () => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      return { isAuthenticated: !!token, user };
    } catch (error) {
      console.error("Error checking storage:", error);
      return { isAuthenticated: false, user: null };
    }
  };
  const { isAuthenticated, user } = checkAuthFromStorage();

  const checkRole = (userObj, requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userObj || !userObj.roles) return false;

    return requiredRoles.some((role) => userObj.roles.includes(role));
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !checkRole(user, requiredRoles)) {
    return <Navigate to="/error" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
