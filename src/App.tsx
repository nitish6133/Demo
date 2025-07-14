import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import DataPage from './pages/DataPage';
import Navigation from './components/Navigation';
import { CartProvider } from './context/CartContext';
import { TableData } from './types';

function App() {
  const [tableData, setTableData] = useState<TableData[]>([]);

  // Add unique IDs to imported data
  const handleDataParsed = (data: TableData[]) => {
    const dataWithIds = data.map((item, index) => ({
      ...item,
      id: `jewelry-${Date.now()}-${index}`
    }));
    setTableData(dataWithIds);
  };

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route 
              path="/admin" 
              element={<AdminPage onDataParsed={handleDataParsed} />} 
            />
            <Route 
              path="/data" 
              element={<DataPage data={tableData} />} 
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;