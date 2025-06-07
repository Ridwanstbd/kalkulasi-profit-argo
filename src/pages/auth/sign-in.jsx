import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Elements/Button";
import InputForm from "../../components/Elements/Input";
import AuthTemplate from "../../components/Fragments/AuthTemplate";
import { useAuth } from "../../contexts/AuthContext";
import useDocumentHead from "../../hooks/useDocumentHead";
import { useEffect, useState } from "react";
import Checkbox from "../../components/Elements/Checkbox";
import { apiBaseUrl } from "../../config/api";
import Alert from "../../components/Elements/Alert";

const SignIn = () => {
  useDocumentHead({
    title: "Masuk",
    description: "Halaman Masuk untuk mengakses Aplikasi",
  });

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const from = "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && loginSuccess) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loginSuccess, navigate, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    if (errors.general) {
      setErrors({
        ...errors,
        general: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setLoginSuccess(false);

    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          setErrors(
            typeof data.errors === "string"
              ? JSON.parse(data.errors)
              : data.errors
          );
          throw new Error("Validasi gagal");
        } else {
          throw new Error(data.message || "Login Gagal");
        }
      }

      if (!data.success) {
        throw new Error(data.message || "Login Gagal");
      }

      await login(data);
      setLoginSuccess(true);
    } catch (err) {
      console.log("Login error:", err.message);
      if (err.message !== "Validasi gagal") {
        setErrors({
          general: err.message || "Terjadi Kesalahan. Silakan coba lagi",
        });
      }
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate title="Masuk" type="login">
      {errors.general && <Alert message={errors.general} />}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputForm
          label="Email"
          name="email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          color="text-white"
          required
        />

        <InputForm
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          color="text-white"
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            name="remember_me"
            onChange={handleChange}
            checked={formData.remember_me}
            label="Ingat Saya"
            color="text-white"
          />

          <div className="text-sm">
            <Link
              to="/auth/forgot-password"
              className="font-medium text-white hover:text-blue-500"
            >
              Lupa Kata Sandi?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className={`w-full ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </AuthTemplate>
  );
};

export default SignIn;
