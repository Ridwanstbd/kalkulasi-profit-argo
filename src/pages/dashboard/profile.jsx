import { useEffect } from "react";
import useDocumentHead from "../../hooks/useDocumentHead";
import { useOutletContext } from "react-router-dom";

const Profile = () => {
  const { setPageTitle, setPageDescription, showAlert } = useOutletContext();

  const pageInfo = {
    title: "Profil Saya",
    description:
      "Halaman ini untuk melihat dan mengubah profil yang terdaftar di aplikasi",
  };
  useDocumentHead(pageInfo);

  useEffect(() => {
    setPageTitle(pageInfo.title);
    setPageDescription(pageInfo.description);
  }, [setPageTitle, setPageDescription, pageInfo.title, pageInfo.description]);

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
      </div>
    </>
  );
};
export default Profile;
