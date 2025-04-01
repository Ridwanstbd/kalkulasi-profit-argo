import { Outlet } from "react-router-dom";

export function Guest() {
  return (
    <div className="max-w-5xl mx-auto">
      <Outlet />
    </div>
  );
}

export default Guest;
