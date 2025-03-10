import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Flame, User, LogOut, Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
const Header = () => {
  const { authUser, logout } = useAuthStore();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropDownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Flame className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white hidden sm:inline">
                Swipe
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4 ">
            {authUser ? (
              <div className="relative" ref={dropDownRef}>
                <button
                  onClick={() => setDropDownOpen(!dropDownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={authUser.image || "/avatar.png"}
                    alt="user avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />

                  <span className="text-white font-medium">
                    {authUser.name}
                  </span>
                </button>
                {dropDownOpen && (
                  <div className="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link
                      to="/profile"
                      className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User className="mr-2" size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="mr-2" size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-white hover:text-pink-200 transition duration-150 ease-in-out"
                >
                  Login
                </Link>

                <Link
                  to="/auth"
                  className="text-white hover:text-pink-600 px-4 py-2 rounded-full font-medium hover:bg-pink-100 transition duration-150 ease-in-out"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none hover:text-pink-200 transition duration-150 ease-in-out"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <MobileMenu
          authUser={authUser}
          logout={logout}
          setMobileMenuOpen={setMobileMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
        />
      )}
    </header>
  );
};

export default Header;
