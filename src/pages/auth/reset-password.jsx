import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/Elements/Button";
import InputForm from "../../components/Elements/Input";
import AuthTemplate from "../../components/Fragments/AuthTemplate";
import useDocumentHead from "../../hooks/useDocumentHead";
import { apiBaseUrl } from "../../config/api";
import Alert from "../../components/Elements/Alert";
import { useAuth } from "../../contexts/AuthContext";

const ResetPassword = () => {
  useDocumentHead({
    title: "Atur Ulang Kata Sandi",
    description: "Halaman untuk mengatur ulang kata sandi",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (!token || !email) {
      navigate("/auth/forgot-password", {
        state: {
          message:
            "Mohon mengakses halaman ini dengan link yang diberikan melalui email.",
        },
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      token,
      email,
    }));
  }, [location, navigate]);

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
      const response = await fetch(`${apiBaseUrl}/v1/reset-password`, {
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
        } else if (response.status === 401 || response.status === 403) {
          setErrors({
            general:
              "Token untuk mengatur ulang kata sandi tidak valid atau sudah kadaluarsa. Silakan coba lagi.",
          });
        } else {
          setErrors({
            general: data.message || "Terjadi kesalahan. Silakan coba lagi.",
          });
        }
        return;
      }

      if (!data.success) {
        setErrors({
          general: data.message || "Terjadi kesalahan. Silakan coba lagi.",
        });
        return;
      }

      if (data.authorization && data.authorization.token) {
        setSuccess(true);

        login(data);

        setTimeout(() => {
          navigate("/dashboard/me");
        }, 2000);
      } else {
        setSuccess(true);

        setTimeout(() => {
          navigate("/auth/login", {
            state: {
              message:
                "Kata sandi berhasil diubah. Silakan login dengan kata sandi baru Anda.",
            },
          });
        }, 2000);
      }
    } catch (err) {
      setErrors({
        general:
          err.message ||
          "Terjadi kesalahan pada sistem. Silakan coba lagi nanti.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate title="Atur Ulang Kata Sandi">
      {errors.general && <Alert type="error" message={errors.general} />}

      {success && (
        <Alert
          type="success"
          message="Kata sandi berhasil diubah. Anda akan diarahkan secara otomatis..."
        />
      )}

      {formData.email && (
        <div className="mb-4 bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            Mengatur ulang kata sandi untuk <strong>{formData.email}</strong>
          </p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputForm
          label="Kata Sandi Baru"
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
          disabled={loading || success || !formData.token || !formData.email}
          className={`bg-blue-600 text-white w-full ${
            loading || success || !formData.token || !formData.email
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? "Memproses..." : "Atur Ulang Kata Sandi"}
        </Button>
      </form>
    </AuthTemplate>
  );
};

export default ResetPassword;
