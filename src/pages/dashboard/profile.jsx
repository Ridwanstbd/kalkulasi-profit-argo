import { useEffect } from "react";
import useDocumentHead from "../../hooks/useDocumentHead";
import { useOutletContext } from "react-router-dom";

const Profile = () => {
  const { setPageTitle, showAlert } = useOutletContext();
  useDocumentHead({
    title: "Profil Saya",
    description: "Ini adalah bagian dari profil saya",
  });

  useEffect(() => {
    setPageTitle("Profil Saya");
  }, [setPageTitle]);

  const handleSaveProduct = () => {
    try {
      // Proses menyimpan produk
      // ...kode proses menyimpan...

      // Jika berhasil
      showAlert("Produk berhasil disimpan!", "success");
    } catch (error) {
      // Jika gagal
      showAlert(`Error: ${error.message}`, "error");
    }
  };

  // Contoh fungsi yang menampilkan warning
  const handleDeleteProduct = () => {
    // Tampilkan warning
    showAlert("Anda yakin ingin menghapus produk ini?", "warning");
  };

  // Contoh fungsi yang menampilkan info
  const handleInfoClick = () => {
    showAlert("Ini adalah halaman untuk mengelola produk.", "info");
  };

  return (
    <>
      <div className="w-full bg-amber-300">MEEEE</div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleSaveProduct}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Simpan Produk (Success)
        </button>

        <button
          onClick={handleDeleteProduct}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Hapus Produk (Warning)
        </button>

        <button
          onClick={handleInfoClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Info
        </button>

        <button
          onClick={() =>
            showAlert("Terjadi kesalahan saat memuat data!", "error")
          }
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Simulasi Error
        </button>
      </div>
    </>
  );
};
export default Profile;
