import { Outlet } from "react-router-dom";
import Navbar from "../components/Fragments/Navbar";

export function Guest() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <Outlet />
      </div>
    </>
  );
}

export default Guest;
