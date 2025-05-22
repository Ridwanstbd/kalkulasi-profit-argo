import { useState } from "react";
import { Menu, X } from "lucide-react";
import Dropdown from "../Elements/Dropdown";
import Anchor from "../Elements/Anchor";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-yellow-500 mr-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="14"
                  cy="14"
                  r="12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M14 2C14 8 20 14 26 14C20 14 14 20 14 26C14 20 8 14 2 14C8 14 14 8 14 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">KalkuPro</span>
          </div>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-6"></div>

          <div className="hidden md:block">
            <Anchor href="/auth/login" variant="primary">
              Masuk
            </Anchor>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="pt-4">
              <Anchor
                href="/auth/login"
                variant="primary"
                className="block w-full text-center"
              >
                Masuk
              </Anchor>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
