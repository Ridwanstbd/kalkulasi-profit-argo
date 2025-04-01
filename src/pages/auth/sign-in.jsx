import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Elements/Button";
import InputForm from "../../components/Elements/Input";
import AuthTemplate from "../../components/Fragments/AuthTemplate";
import { useAuth } from "../../contexts/AuthContext";
import useDocumentHead from "../../hooks/useDocumentHead";
import { useEffect, useState } from "react";
import Checkbox from "../../components/Elements/Checkbox";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const SignIn = () => {
  useDocumentHead({
    title: "Login",
    description: "Halaman login untuk mengakses Aplikasi",
  });

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/me";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Effect untuk melakukan redirect setelah login sukses
  useEffect(() => {
    if (isAuthenticated && loginSuccess) {
      console.log("Authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loginSuccess, navigate, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login Gagal");
      }
      login(data);
      setLoginSuccess(true);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Terjadi Kesalahan. Silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthTemplate title="Masuk">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputForm
          label="Email"
          name="email"
          type="email"
          placeholder="test@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        <InputForm
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            name="remember_me"
            onChange={handleChange}
            checked={formData.remember_me}
          />

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Lupa Kata Sandi?
            </a>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          style={`bg-blue-600 text-white w-full ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </AuthTemplate>
  );
};

export default SignIn;
