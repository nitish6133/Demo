import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { User, Mail, Lock, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "../components/UI/ToastContainer";
import Layout from "../components/Layout/Layout";

const Register: React.FC = () => {
  const { registerUser } = useAuthStore();
  const { showSuccess, showError } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const isValid = username.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword;
    setIsFormValid(isValid);
  }, [username, email, password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Password Mismatch", "Passwords don't match! Please try again. 🔐");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        username,
        email,
        password,
      });

      if (response.code === 1046) {
        showSuccess("Account Created!", "Welcome to our magical world! Please sign in now. 🎉");
        setTimeout(() => navigate("/login"), 2000);
      } else if (response.code === 1044) {
        showError("Account Exists", "This email is already registered. Try signing in instead! 📧");
      } else if (response.code === 1045) {
        showError("Server Busy", "Our servers are busy. Please try again in a moment! ⏰");
      } else {
        showError("Registration Failed", response.message || "Something went wrong. Please try again! 🔧");
      }
    } catch (error: any) {
      showError("Registration Error", "An unexpected error occurred. Please try again! 🚨");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-rainbow">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20"
            animate={{
              background: [
                "linear-gradient(to right, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
                "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))",
                "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(34, 197, 94, 0.2))"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

        </div>

        {/* Register Form */}
        <div className="relative container mx-auto px-4 py-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-rainbow border-3 border-green-200 overflow-hidden"
              animate={{
                boxShadow: [
                  "0 8px 32px rgba(34, 197, 94, 0.3)",
                  "0 12px 40px rgba(34, 197, 94, 0.5)",
                  "0 8px 32px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h2 className="text-2xl font-bold font-display text-white mb-2">
                    Create Account
                  </h2>
                  <p className="text-green-100 font-semibold">
                    Start your magical journey!
                  </p>
                </motion.div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Username Input */}
                  <div className="space-y-2">
                    <label className="block text-lg font-bold text-green-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span>Username</span>
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, 1, -1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="relative w-full px-4 py-3 bg-white border-2 border-green-200 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-green-800 placeholder-green-400 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-lg font-bold text-blue-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        <span>Email Address</span>
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, -1, 1, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="relative w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-blue-800 placeholder-blue-400 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="block text-lg font-bold text-purple-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <span>Password</span>
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, 1, -1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="relative w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-purple-800 placeholder-purple-400 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="block text-lg font-bold text-pink-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <span>Confirm Password</span>
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, -1, 1, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter Confirm password"
                        className="relative w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-pink-800 placeholder-pink-400 font-semibold"
                        required
                      />
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 text-sm font-semibold flex items-center gap-1"
                      >
                        <span>⚠️</span>
                        Passwords don't match!
                      </motion.p>
                    )}
                  </div>

                  {/* Register Button */}
                  <motion.button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-fun ${isFormValid && !isLoading
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    whileHover={isFormValid && !isLoading ? {
                      scale: 1.02,
                      y: -2,
                      boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)"
                    } : {}}
                    whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>🎭 Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Register</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Login Link */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-green-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-green-600 font-semibold">
                        Already a hero?
                      </span>
                    </div>
                  </div>

                  <motion.div className="mt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-fun"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                  </motion.div>

                  <p className="mt-3 text-sm text-green-600 font-semibold">
                    Already have an account? Sign in here!
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

export default Register;