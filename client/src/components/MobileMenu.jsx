import { Link } from "react-router-dom";

const MobileMenu = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  authUser,
  logout,
}) => {
  if (!mobileMenuOpen) return null;

  return (
    <div className="md:hidden bg-pink-600">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {authUser ? (
          <>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/auth"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
