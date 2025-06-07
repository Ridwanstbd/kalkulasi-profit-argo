import { useEffect, useState } from "react";
import useDocumentHead from "../../../hooks/useDocumentHead";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import { apiBaseUrl } from "../../../config/api";
import Loading from "../../../components/Elements/Loading";
import InputForm from "../../../components/Elements/Input";
import Button from "../../../components/Elements/Button";
import Alert from "../../../components/Elements/Alert";

const Profile = () => {
  const { setPageTitle, setPageDescription, showAlert } = useOutletContext();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errors, setErrors] = useState({});

  const pageInfo = {
    title: "Profil Saya",
    description:
      "Halaman ini untuk melihat dan mengubah profil yang terdaftar di aplikasi",
  };
  useDocumentHead(pageInfo);

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const userId = user?.id || data.id;
        if (!userId) {
          showAlert("User ID tidak ditemukan", "error");
          return;
        }

        const response = await axios.get(
          `${apiBaseUrl}/api/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data.success) {
          setData(response.data.user);
          setFormData({
            name: response.data.user.name,
            email: response.data.user.email,
            current_password: "",
            password: "",
            password_confirmation: "",
          });
        } else {
          showAlert(response.data.message || "Gagal memuat profil", "error");
        }
      } catch (error) {
        showAlert(
          `Gagal memuat data: ${
            error.response?.data?.message || error.message
          }`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && (user?.id || data.id)) {
      fetchProfile();
    }
  }, [
    setPageTitle,
    setPageDescription,
    pageInfo.title,
    pageInfo.description,
    token,
    user?.id,
    showAlert,
    data.id,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setErrors({});

      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (showPasswordForm && formData.password) {
        updateData.current_password = formData.current_password;
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const response = await axios.put(
        `${apiBaseUrl}/api/profile/${data.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setData(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          current_password: "",
          password: "",
          password_confirmation: "",
        });
        setIsEditing(false);
        setShowPasswordForm(false);
        setErrors({});
        showAlert(response.data.message, "success");
      } else {
        showAlert(response.data.message || "Gagal memperbarui profil", "error");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        setErrors(
          typeof validationErrors === "string"
            ? JSON.parse(validationErrors)
            : validationErrors
        );
      } else {
        setErrors({
          general:
            error.response?.data?.message ||
            error.message ||
            "Gagal memperbarui profil",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: data.name,
      email: data.email,
      current_password: "",
      password: "",
      password_confirmation: "",
    });
    setIsEditing(false);
    setShowPasswordForm(false);
    setErrors({});
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {!isEditing ? (
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <p className="text-lg text-gray-900">{data.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-lg text-gray-900">{data.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={() => setIsEditing(true)} variant="primary">
              Edit Profil
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Edit Profil
            </h2>
            <p className="text-gray-600">Perbarui informasi profil Anda</p>
          </div>

          {errors.general && <Alert message={errors.general} />}

          <InputForm
            label="Nama Lengkap"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />

          <InputForm
            label="Email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />

          <div>
            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showPasswordForm ? "Batalkan ubah password" : "Ubah password"}
            </button>
          </div>

          {showPasswordForm && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-md">
              <InputForm
                label="Password Saat Ini"
                name="current_password"
                type="password"
                placeholder="••••••••"
                value={formData.current_password}
                onChange={handleInputChange}
                error={errors.current_password}
                autoComplete="current-password"
              />

              <InputForm
                label="Password Baru"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                autoComplete="new-password"
                minLength="8"
              />

              <InputForm
                label="Konfirmasi Password Baru"
                name="password_confirmation"
                type="password"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                error={errors.password_confirmation}
                autoComplete="new-password"
                minLength="8"
              />
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            <Button
              type="submit"
              disabled={saving}
              variant="primary"
              className={saving ? "opacity-70 cursor-not-allowed" : ""}
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>

            <Button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              variant="secondary"
              className={saving ? "opacity-70 cursor-not-allowed" : ""}
            >
              Batal
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
