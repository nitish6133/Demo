import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/UI/ToastContainer';
import PublicRoute from './components/PublicRouter';
import React from "react";
import { useAuthStore } from './stores/useAuthStore';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';


function App() {
  const { user, verifySessionPeriodically, verifyTokenAfterLogin, authState, isAuthenticated } = useAuthStore();
  const adminRole = import.meta.env.VITE_ADMIN_ROLE || 'admin';
  
  // Verify token on app load
  React.useEffect(() => {
    if (authState === 'notChecked') {
      verifyTokenAfterLogin();
    }
  }, [verifyTokenAfterLogin, authState]);

  // Auto-redirect based on user role after login
  React.useEffect(() => {
    if (user && isAuthenticated && authState === 'valid') {
      const isUserAdmin = user.role === adminRole;
      const currentPath = window.location.pathname;
      
      // If admin is on home page, redirect to admin page
      if (isUserAdmin && currentPath === '/') {
        window.history.replaceState(null, '', '/admin');
      }
      // If regular user is on admin page, redirect to home
      else if (!isUserAdmin && currentPath === '/admin') {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [user, isAuthenticated, authState, adminRole]);
  // Periodic session verification
  React.useEffect(() => {
    if (!user || authState !== 'valid') return;

    const interval = setInterval(() => {
      verifySessionPeriodically();
    }, 5000); // Check every 30 seconds instead of 5

    return () => clearInterval(interval);
  }, [user, verifySessionPeriodically, authState]);


  return (
    <ToastProvider>
      <Router>
        <div className="relative min-h-screen">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* User-only route */}
            <Route
              path="/"
              element={
                <ProtectedRoute userOnly={true}>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Admin-only route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
