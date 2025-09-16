import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/UI/ToastContainer';
import PublicRoute from './components/PublicRouter';
import React from "react";
import { useAuthStore } from './stores/useAuthStore';
import HomePage from './pages/HomePage';


function App() {
  const { user, verifySessionPeriodically, verifyTokenAfterLogin, authState } = useAuthStore();
  
  // Verify token on app load
  React.useEffect(() => {
    if (authState === 'notChecked') {
      verifyTokenAfterLogin();
    }
  }, [verifyTokenAfterLogin, authState]);

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

            {/* Protected routes (only when logged in) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
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
