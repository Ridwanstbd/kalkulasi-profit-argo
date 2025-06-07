import { Outlet } from "react-router-dom";

export function Guest() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 backdrop-blur-sm"
      style={{
        backgroundImage: "url('/img/images/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Outlet />
    </div>
  );
}

export default Guest;
