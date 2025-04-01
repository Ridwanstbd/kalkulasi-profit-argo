import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-lg mb-6">
        Maaf, halaman yang Anda cari tidak tersedia.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default ErrorPage;
