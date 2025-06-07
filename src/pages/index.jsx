import useDocumentHead from "../hooks/useDocumentHead";

export function Index() {
  useDocumentHead({
    title: "Kalkulasi Profit",
    description: "Mudah Profit dengan Kalkulasi profit",
  });

  return (
    <>
      <div className="flex flex-col md:flex-row bg-black/30 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-2/4">
        <div className="justify-center">
          <h1 className="text-2xl md:text-5xl font-bold my-2.5 text-white mb-8 [-webkit-text-stroke-width:1px] [-webkit-text-stroke-color:black]">
            Kalkulasi Profit Bengkel Argo Blastcoating🙌
          </h1>
          <a
            href="/auth/login"
            className="text-base font-medium bg-gradient-to-br from-blue-600 to-teal-500 px-8 py-3 rounded-full text-white hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out"
          >
            Mulai Hitung!
          </a>
        </div>
      </div>
    </>
  );
}

export default Index;
