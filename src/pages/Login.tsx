import React, { useState, useEffect } from "react";
import { Mail, Lock, Chrome, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "../components/UI/ToastContainer";
import { useProjectConfig } from "../hooks/useProjectConfig";
import { serviceBaseUrl } from "../constants/appConstants";
import type { LoginProps } from "../types";
import Layout from "../components/Layout/Layout";
import Button from "../components/UI/Button";

const Login: React.FC<LoginProps> = ({
  backendUrl = serviceBaseUrl,
  onSuccess,
  googleLogintheme = {},
}) => {
  const {
    Login,
    isLoading: authLoading,
    error: authError,
    clearError,
    loginWithGoogle,
    verifyTokenAfterLogin,
    setBackendUrl,
  } = useAuthStore();

  const user = useAuthStore.getState().user;
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { theme } = useProjectConfig();
  const adminRole = import.meta.env.VITE_ADMIN_ROLE || "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verify token on mount
  useEffect(() => {
    verifyTokenAfterLogin();
  }, [verifyTokenAfterLogin]);

  // Validate form fields
  useEffect(() => {
    setIsFormValid(email.length > 0 && password.length > 0);
  }, [email, password]);

  // Cleanup error on unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Handle backend URL setup
  useEffect(() => {
    if (backendUrl) {
      setBackendUrl(backendUrl);
    }
  }, [backendUrl, setBackendUrl]);

  // Redirect after successful login
  useEffect(() => {
    if (user && onSuccess) {
      onSuccess(user);
    }
    if (user) {
      if (user.role === adminRole) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate, adminRole, onSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await Login(email, password);

    if (!result.success) {
      showError(result.error || "Login failed. Please try again!");
      setError(result.error);
    } else {
      showSuccess("Welcome Back!", "Successfully logged in!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error("Google login failed:", err);
      setError("Google authentication failed. Please try again later.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="shadow-lg border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="space-y-2 text-center p-8 pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <div className="px-8 pb-8 space-y-4">
              {error && (
                <div className="flex items-center p-3 border border-orange-200 bg-orange-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm text-orange-800">{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="email-input"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="password-input"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                  required
                />
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                onClick={handleLogin}
                disabled={!isFormValid || authLoading}
                data-testid="sign-in-button"
                className={`w-full h-12 font-semibold rounded-xl text-white transition-colors ${
                  isFormValid
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Google Login Button */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                data-testid="google-login-button"
                className="w-full h-12 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center"
              >
                <Chrome className="mr-3 h-5 w-5 text-blue-500" />
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    New to the portal?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full h-11 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  Create Account
                </Link>
                <p className="text-sm text-gray-600 mt-3">
                  Don’t have an account? Join our community today!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-gray-100 text-center text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </motion.div>

          {/* Support Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
