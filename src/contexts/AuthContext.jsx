/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiBaseUrl } from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      console.error("Token parsing error:", error);
      return true; // If there's any error parsing, consider token expired
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            console.log("Token expired, logging out");
            logout();
          } else {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setupTokenExpirationCheck(storedToken);
          }
        }
      } catch (error) {
        console.error("Authentication Error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Setup token expiration checking
  const setupTokenExpirationCheck = (currentToken) => {
    try {
      if (!currentToken) return;

      const payload = JSON.parse(atob(currentToken.split(".")[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const timeUntilExpiry = expiryTime - Date.now();

      if (timeUntilExpiry <= 0) {
        // Token already expired
        logout();
        return;
      }

      // Set timer to logout when token expires
      const tokenExpiryTimer = setTimeout(() => {
        console.log("Token expired, logging out automatically");
        logout();
      }, timeUntilExpiry);

      // Cleanup timer on unmount
      return () => clearTimeout(tokenExpiryTimer);
    } catch (error) {
      console.error("Error setting up token expiration check:", error);
      // If we can't read the token, better to logout
      logout();
    }
  };

  useEffect(() => {
    setIsAuthenticated(!!token);

    if (token) {
      return setupTokenExpirationCheck(token);
    }
  }, [token]);

  // Intercept API responses to check for token validity
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Check if response status is 401 (Unauthorized)
      if (response.status === 401) {
        // Check if the URL is not the logout endpoint to avoid infinite loops
        const url = typeof args[0] === "string" ? args[0] : args[0].url;
        if (!url.includes("/logout")) {
          console.log("Received 401 response, logging out");
          logout();
        }
      }

      return response.clone();
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const login = (userData) => {
    const { user, authorization } = userData;
    const { token } = authorization;

    setUser(user);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = async () => {
    try {
      if (token) {
        const response = await fetch(`${apiBaseUrl}/v1/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.error("Logout API call failed:", response.statusText);
        }
      }
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Instead of using useNavigate, we'll use window.location for redirection
      window.location.href = "/auth/login";
    }
  };

  const hasRole = (role) => {
    return user?.roles.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan dengan AuthProvider");
  }
  return context;
};
