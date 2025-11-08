import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, AlertTriangle, ArrowRight } from "lucide-react";
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
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Validate form
  useEffect(() => {
    const valid =
      username.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword;
    setIsFormValid(valid);
  }, [username, email, password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser({ username, email, password });

      if (response.code === 1046) {
        showSuccess("Account Created!", "Welcome aboard! Please sign in now.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (response.code === 1044) {
        setError("This email is already registered. Try signing in instead!");
      } else if (response.code === 1045) {
        setError("Server busy. Please try again in a moment.");
      } else {
        setError(response.message || "Registration failed. Please try again!");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-600">Join our community and get started</p>
            </div>

            {/* Form */}
            <div className="px-8 pb-8 space-y-4">
              {error && (
                <div className="flex items-center p-3 border border-orange-200 bg-orange-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm text-orange-800">{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                    required
                  />
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`w-full h-12 font-semibold rounded-xl text-white transition-colors ${
                    isFormValid
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "Creating account..." : "Register"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full h-11 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Sign In
                </Link>
                <p className="text-sm text-gray-600 mt-3">
                  Return to login page and access your account.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-gray-100 text-center text-xs text-gray-500">
              By creating an account, you agree to our{" "}
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

          {/* Support */}
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

export default Register;
