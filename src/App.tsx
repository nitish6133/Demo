import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { TableData } from './types';

// Components
import PublicHeader from './components/PublicHeader';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import DataPage from './pages/DataPage';

function App() {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const { user } = useAuthStore();

  // Add unique IDs to imported data
  const handleDataParsed = (data: TableData[]) => {
    const dataWithIds = data.map((item, index) => ({
      ...item,
      id: `jewelry-${Date.now()}-${index}`
    }));
    setTableData(dataWithIds);
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/data');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Conditional Header */}
        {user?.role === 'admin' && isAdminRoute ? (
          <Navigation />
        ) : (
          <PublicHeader />
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage products={tableData} />} />
          <Route path="/product/:id" element={<ProductDetailPage products={tableData} />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected User Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute requiredRole="user">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage onDataParsed={handleDataParsed} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data" 
            element={
              <ProtectedRoute requiredRole="admin">
                <DataPage data={tableData} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;