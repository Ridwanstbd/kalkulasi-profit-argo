import { Anchor } from "lucide-react";
import useDocumentHead from "../hooks/useDocumentHead";

export function Index() {
  useDocumentHead({
    title: "Kalkulasi Profit",
    description: "Mudah Profit dengan Kalkulasi profit",
  });
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-2 my-2.5 px-4">
        <div className="">
          <h1 className="text-3xl md:text-5xl font-bold my-2.5 text-gray-800 mb-8">
            Lelah Rugi Karena Salah Hitung Biaya? Saatnya Gunakan Aplikasi
            Analisa Keuntungan yang Cerdas!🙌
          </h1>
          <a
            href="#"
            className="text-base font-medium bg-gradient-to-br from-blue-600 to-teal-500 px-8 py-3 rounded-full text-white hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out"
          >
            Mulai Hitung!
          </a>
        </div>
        <div className="">
          <img
            src="../../public/img/images/hero.png"
            className="rounded-xl"
            alt="ilustration"
          />
        </div>
      </div>
    </>
  );
}
export default Index;
