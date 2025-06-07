const AuthTemplate = (props) => {
  const { children, title } = props;
  return (
    <div className="flex flex-col md:flex-row bg-black/30 backdrop-blur-sm rounded-lg w-full shadow-lg">
      <div className="w-full md:rounded-l-md md:w-1/2 min-h-[200px] md:min-h-[400px] flex items-center justify-center backdrop-blur-sm">
        <div className="text-center w-full">
          <span className="text-lg font-semibold text-white">
            Selamat Datang
          </span>
          <h2 className="text-2xl font-bold text-white">
            Kalkulasi Profit Bengkel
          </h2>
          <h2 className="text-3xl font-bold text-white">Argo Blast Coating</h2>
        </div>
      </div>
      <div className="w-full md:w-1/2 py-8 px-6 md:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthTemplate;
