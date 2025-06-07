import { Outlet } from "react-router-dom";

export function Auth() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/img/images/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-3xl w-full shadow-md rounded-lg overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
