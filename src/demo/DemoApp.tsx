import React from 'react';
import Login from '../components/Login';
import type { User } from '../types';

// Demo app for development and testing
const DemoApp: React.FC = () => {
  const handleLoginSuccess = (user: User) => {
    console.log('Demo: User logged in successfully:', user);
    alert(`Welcome ${user.username}! Check the console for user details.`);
  };

  const customTheme = {
    primaryColor: '#10B981',
    backgroundColor: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <div className="min-h-screen">
      <div className="p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8">
          React Login Component Demo
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Default Theme</h2>
            <Login
              onSuccess={handleLoginSuccess}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Custom Theme</h2>
            <Login
              onSuccess={handleLoginSuccess}
              theme={customTheme}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Custom Backend URL</h2>
            <Login
              backendUrl="https://custom-api.example.com/api"
              onSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoApp;