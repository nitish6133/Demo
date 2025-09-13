import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "../components/UI/ToastContainer";
import Layout from "../components/Layout/Layout";

const Login: React.FC = () => {
  const {
    Login,
    isLoading: authLoading,
    error: authError,
    clearError: clearAuthError,
    verifyTokenAfterLogin,
  } = useAuthStore();

  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState("user@123.com");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verifyTokenAfterLogin();
  }, [verifyTokenAfterLogin]);

  useEffect(() => {
    setIsFormValid(email.length > 0 && password.length > 0);
  }, [email, password]);

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    const success = await Login(email, password);
    if (!success) {
      showError(
        "Login Failed",
        authError || "Invalid credentials. Please try again!"
      );
    } else {
      showSuccess(
        "Welcome Back!",
        "Successfully logged in! Let's explore your future!"
      );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <motion.div
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-rainbow border border-purple-200 overflow-hidden"
            animate={{
              boxShadow: [
                "0 6px 20px rgba(139, 92, 246, 0.25)",
                "0 12px 40px rgba(236, 72, 153, 0.35)",
                "0 6px 20px rgba(139, 92, 246, 0.25)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
              <motion.h2
                className="text-2xl font-extrabold font-display text-white mb-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Sign In
              </motion.h2>
              <p className="text-purple-100 font-medium">
                Enter your magical portal!
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-purple-800 placeholder-purple-400 font-medium"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-pink-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </div>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secret key"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-pink-800 placeholder-pink-400 font-medium"
                    required
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || authLoading}
                  className={`w-full py-3 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-fun transition-all duration-300 ${
                    isFormValid && !authLoading
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={
                    isFormValid && !authLoading
                      ? {
                          scale: 1.02,
                          boxShadow: "0 12px 24px rgba(147, 51, 234, 0.35)",
                        }
                      : {}
                  }
                  whileTap={
                    isFormValid && !authLoading ? { scale: 0.97 } : {}
                  }
                >
                  {authLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="mt-8 relative flex items-center">
                <div className="w-full border-t border-purple-200"></div>
                <span className="px-3 bg-white text-purple-600 font-medium text-sm">
                  New here?
                </span>
                <div className="w-full border-t border-purple-200"></div>
              </div>

              {/* Register */}
              <div className="mt-6 text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-fun"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </Link>
                <p className="mt-3 text-sm text-purple-600 font-medium">
                  Don’t have an account? Join our magical journey!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
