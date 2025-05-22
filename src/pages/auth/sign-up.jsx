import { useEffect, useState } from "react";
import AuthTemplate from "../../components/Fragments/AuthTemplate";
import useDocumentHead from "../../hooks/useDocumentHead";
import InputForm from "../../components/Elements/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { apiBaseUrl } from "../../config/api";
import Button from "../../components/Elements/Button";
import Alert from "../../components/Elements/Alert";

const SignUp = () => {
  useDocumentHead({
    title: "Daftar",
    description: "Pendaftaran aplikasi Kalkulasi Profit",
  });

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && signUpSuccess) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, signUpSuccess, navigate, from]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await fetch(`${apiBaseUrl}/v1/register`, {
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
          setErrors(JSON.parse(data.errors));
          throw new Error("Validasi gagal");
        } else {
          throw new Error(data.message || "Register Gagal");
        }
      }
      if (!data.success) {
        throw new Error(data.message || "Register Gagal");
      }

      const loginData = {
        user: data.data.user,
        authorization: {
          token: data.data.token,
          type: "Bearer",
          expires_in: 60 * 60 * 24,
        },
      };

      login(loginData);
      setSignUpSuccess(true);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.message !== "Validasi gagal") {
        setErrors({
          general: err.message || "Terjadi Kesalahan. Silakan coba lagi",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthTemplate title="Daftar" type="register">
      {errors.general && <Alert message={errors.general} />}
      <form className="space-y-2" onSubmit={handleSubmit}>
        <InputForm
          label="Nama"
          name="name"
          type="text"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <InputForm
          label="Email"
          name="email"
          type="email"
          placeholder="ridwansetiobudi@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <InputForm
          label="Kata Sandi"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <InputForm
          label="Konfirmasi Kata Sandi"
          name="password_confirmation"
          type="password"
          placeholder="••••••••"
          value={formData.password_confirmation}
          onChange={handleChange}
          error={errors.password_confirmation}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white w-full ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Memproses..." : "Daftar"}
        </Button>
      </form>
    </AuthTemplate>
  );
};
export default SignUp;
