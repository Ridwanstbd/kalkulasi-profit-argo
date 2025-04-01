const AuthTemplate = (props) => {
  const { children, title } = props;
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 border-2 border-gray-400 rounded-lg w-full">
      <div className="bg-amber-300 w-full md:rounded-l-md md:w-1/2 min-h-[200px] md:min-h-[400px] flex items-center justify-center">
        <div className="text-center w-full">
          <span className="text-lg font-semibold text-black">Welcome to</span>
          <h2 className="text-2xl font-bold text-black">Profiting UMKM</h2>
        </div>
      </div>
      <div className="w-full md:w-1/2 py-8 px-6 md:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthTemplate;
