import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "../components/UI/ToastContainer";
import CartoonBackground from "../components/CartoonBackground";
import Layout from "../components/Layout/Layout";

const Login: React.FC = () => {
  const {
    Login,
    isLoading: authLoading,
    error: authError,
    clearError: clearAuthError,
    verifyTokenAfterLogin
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
      showError("Login Failed", authError || "Invalid credentials. Please try again!");
    } else {
      showSuccess("Welcome Back!", "Successfully logged in! Let's explore your future!");
      // Navigation will happen automatically via ProtectedRoute
    }
  };


  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <CartoonBackground variant="home" />

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-rainbow">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"
            animate={{
              background: [
                "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2), rgba(59, 130, 246, 0.2))",
                "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2))",
                "linear-gradient(to right, rgba(219, 39, 119, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="relative container mx-auto px-4 pt-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  className="p-3 bg-white/30 backdrop-blur-sm rounded-2xl shadow-fun"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h1
                  className="text-4xl sm:text-6xl font-bold font-display text-white"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Welcome Back!
                </motion.h1>
              </div>
              <motion.p
                className="text-xl text-white/90 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Ready to explore your amazing future?
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Login Form */}
        <div className="relative container mx-auto px-4 py-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-rainbow border-3 border-purple-200 overflow-hidden"
              animate={{
                boxShadow: [
                  "0 8px 32px rgba(139, 92, 246, 0.3)",
                  "0 12px 40px rgba(139, 92, 246, 0.5)",
                  "0 8px 32px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h2 className="text-2xl font-bold font-display text-white mb-2">
                    Sign In
                  </h2>
                  <p className="text-purple-100 font-semibold">
                    Enter your magical portal!
                  </p>
                </motion.div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-lg font-bold text-purple-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        <span>Email Address</span>
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, 1, -1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="relative w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-purple-800 placeholder-purple-400 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="block text-lg font-bold text-pink-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <span>Password</span>
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, -1, 1, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your secret key"
                        className="relative w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-pink-800 placeholder-pink-400 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={!isFormValid || authLoading}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-fun ${isFormValid && !authLoading
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    whileHover={isFormValid && !authLoading ? {
                      scale: 1.02,
                      y: -2,
                      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
                    } : {}}
                    whileTap={isFormValid && !authLoading ? { scale: 0.98 } : {}}
                  >
                    {authLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>🎭 Logging in...</span>
                      </>
                    ) : (
                      <>
                        <span>Login in</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Register Link */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-purple-600 font-semibold">
                        New here?
                      </span>
                    </div>
                  </div>

                  <motion.div className="mt-4">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-fun"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </Link>
                  </motion.div>

                  <p className="mt-3 text-sm text-purple-600 font-semibold">
                    Don't have an account? Join our magical journey!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;