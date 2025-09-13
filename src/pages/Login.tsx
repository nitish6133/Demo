import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "../components/UI/ToastContainer";
import Layout from "../components/Layout/Layout";
import { useProjectConfig } from "../hooks/useProjectConfig";

const Login: React.FC = () => {
  const {
    Login,
    isLoading: authLoading,
    error: authError,
    clearError: clearAuthError,
    verifyTokenAfterLogin,
  } = useAuthStore();

  const { showSuccess, showError } = useToast();
  const { theme } = useProjectConfig();
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
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-rainbow overflow-hidden"
            style={{ borderColor: theme.colors.primary[200] }}
            animate={{
              boxShadow: [
                `0 6px 20px ${theme.colors.primary[500]}40`,
                `0 12px 40px ${theme.colors.accent[500]}60`,
                `0 6px 20px ${theme.colors.primary[500]}40`,
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Header */}
            <div 
              className="p-6 text-center"
              style={{ background: theme.gradients.primary }}
            >
              <motion.h2
                className="text-2xl font-extrabold font-display text-white mb-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Sign In
              </motion.h2>
              <p className="text-white/80 font-medium">
                Enter your magical portal!
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme.colors.primary[700] }}
                  >
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
                    className="w-full px-4 py-3 rounded-2xl border-2 bg-white transition-all duration-300 font-medium"
                    style={{ 
                      borderColor: theme.colors.primary[200],
                      color: theme.colors.primary[800]
                    }}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme.colors.secondary[700] }}
                  >
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
                    className="w-full px-4 py-3 rounded-2xl border-2 bg-white transition-all duration-300 font-medium"
                    style={{ 
                      borderColor: theme.colors.secondary[200],
                      color: theme.colors.secondary[800]
                    }}
                    required
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || authLoading}
                  className={`w-full py-3 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-fun transition-all duration-300 text-white ${
                    isFormValid && !authLoading
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    background: isFormValid && !authLoading ? theme.gradients.primary : '#e5e7eb'
                  }}
                  whileHover={
                    isFormValid && !authLoading
                      ? {
                          scale: 1.02,
                          boxShadow: `0 12px 24px ${theme.colors.primary[500]}60`,
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
                <div className="w-full border-t" style={{ borderColor: theme.colors.primary[200] }}></div>
                <span 
                  className="px-3 bg-white font-medium text-sm"
                  style={{ color: theme.colors.primary[600] }}
                >
                  New here?
                </span>
                <div className="w-full border-t" style={{ borderColor: theme.colors.primary[200] }}></div>
              </div>

              {/* Register */}
              <div className="mt-6 text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl transition-all duration-300 shadow-fun"
                  style={{ background: theme.gradients.secondary }}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </Link>
                <p 
                  className="mt-3 text-sm font-medium"
                  style={{ color: theme.colors.primary[600] }}
                >
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
