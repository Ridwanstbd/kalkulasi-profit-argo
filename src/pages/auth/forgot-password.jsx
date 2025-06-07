import AuthTemplate from "../../components/Fragments/AuthTemplate";
import useDocumentHead from "../../hooks/useDocumentHead";
import InputForm from "../../components/Elements/Input/index";
import { useState } from "react";
import Alert from "../../components/Elements/Alert";
import Button from "../../components/Elements/Button";
import Checkbox from "../../components/Elements/Checkbox";
import { apiBaseUrl } from "../../config/api";

const ForgotPassword = () => {
  useDocumentHead({
    title: "Lupa Password Aplikasi",
    description: "Halaman untuk mengajukan atur ulang kata sandi",
  });
  const [formData, setFormData] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "confirm") {
      setIsConfirmed(checked);
    } else {
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
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) {
      setErrors({
        ...errors,
        general: "Silakan konfirmasi untuk mengirim link atur ulang kata sandi",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/forgot-password`, {
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
        } else {
          setErrors({
            general:
              data.message || "Terjadi kesalahan saat mengajukan permintaan.",
          });
        }
        return;
      }

      if (!data.success) {
        setErrors({
          general:
            data.message || "Terjadi kesalahan saat mengajukan permintaan.",
        });
        return;
      }

      setSuccess(true);
      setFormData({ email: "" });
      setIsConfirmed(false);
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
    <AuthTemplate title="Lupa Kata Sandi">
      {errors.general && <Alert type="error" message={errors.general} />}

      {success && (
        <Alert
          type="success"
          message="Link atur ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam Anda."
        />
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputForm
          label="Email Saya"
          name="email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          color="text-white"
          required
        />
        <Checkbox
          name="confirm"
          label="Izinkan pihak aplikasi untuk mengirim link atur ulang kata sandi ke email saya"
          checked={isConfirmed}
          onChange={handleChange}
          color="text-white"
        />
        <Button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white w-full ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Memproses..." : "Kirim"}
        </Button>
      </form>
    </AuthTemplate>
  );
};
export default ForgotPassword;
