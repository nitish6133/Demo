import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Home, Users } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { motion } from "framer-motion";
import { useStudentProfileStore } from "../../stores/studentProfileStore";


const Navbar: React.FC = () => {
  const { logout, user } = useAuthStore();
  const { fetchProfiles } = useStudentProfileStore();

  // Fetch profiles when component mounts to ensure navbar shows correct counts
  React.useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user, fetchProfiles]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Links */}
          <div className="flex items-center gap-4 sm:gap-8">
            {user && (
              <>
                {/* Logo */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/"
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Home className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 drop-shadow" />
                    </motion.div>
                    <span className="font-semibold text-sm sm:text-lg bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow">
                      Future Citizen
                    </span>
                  </Link>
                </motion.div>

                {/* Profiles */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/profiles"
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 drop-shadow" />
                    </motion.div>
                    <span className="font-semibold text-sm sm:text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow">
                      Student Profiles
                    </span>
                  </Link>
                </motion.div>

                {/* School Profiles */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/schoolProfileForm"
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 drop-shadow" />
                    </motion.div>
                    <span className="font-semibold text-sm sm:text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow">
                      School Profile
                    </span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>


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
