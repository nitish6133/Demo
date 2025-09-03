import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { LoginProps, User } from "../types";
import { createAuthService } from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore";
import Button from "./Button";

const Login: React.FC<LoginProps> = ({
  backendUrl,
  onSuccess,
  theme = {},
  customLayout,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthStore();
  
  const authService = createAuthService(backendUrl);

  // Apply theme styles
  const themeStyles = {
    '--primary-color': theme.primaryColor || '#3B82F6',
    '--bg-color': theme.backgroundColor || '#F8FAFC',
    fontFamily: theme.fontFamily || 'inherit',
  } as React.CSSProperties;

  useEffect(() => {
    // Check for authentication after login redirect
    const verifyTokenAfterLogin = async () => {
      try {
        const data = await authService.verifyTokenForLogin();
        if (data?.code === 1040 && data?.result) {
          const userData: User = data.result;
          setUser(userData);
          onSuccess?.(userData);
        }
      } catch (error) {
        console.error("Error verifying token after login:", error);
      }
    };

    verifyTokenAfterLogin();
  }, [backendUrl, onSuccess]);

  const handleContinueWithGoogle = () => {
    setIsLoading(true);
    try {
      const redirectUrl = authService.getProviderLoginUrl("google");
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error during login redirection:", error);
      setIsLoading(false);
    }
  };

  // If user is already logged in, show success state
  if (user) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center px-4 py-12 ${className}`}
        style={themeStyles}
      >
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user.username}!
            </h2>
            <p className="text-gray-600">
              You have successfully logged in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Custom layout override
  if (customLayout) {
    return (
      <div style={themeStyles} className={className}>
        {customLayout}
      </div>
    );
  }

  // Default login form
  return (
    <div 
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${className}`}
      style={{
        ...themeStyles,
        background: `linear-gradient(135deg, ${theme.backgroundColor || '#EBF4FF'}, ${theme.primaryColor || '#DBEAFE'})`,
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-6">
            <Button
              onClick={handleContinueWithGoogle}
              loading={isLoading}
              className="w-full cursor-pointer"
              size="lg"
              style={{
                backgroundColor: theme.primaryColor || '#3B82F6',
              }}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;