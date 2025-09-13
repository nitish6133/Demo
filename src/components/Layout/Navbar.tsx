import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Home, Users } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { motion } from "framer-motion";


const Navbar: React.FC = () => {
  const { logout, user } = useAuthStore();


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 sm:gap-8"></div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400 drop-shadow" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
                    {user.username || user.email.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-pink-400 hover:text-red-500 transition-all"
                  data-testid="logout-button"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 drop-shadow" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                data-testid="login-link"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-xl font-semibold  transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
