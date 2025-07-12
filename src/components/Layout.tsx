import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-secondary flex justify-center px-4 py-6 ${className}`}>
      <div className="w-full max-w-3xl">
        {children}
      </div>
    </div>
  );
};

export default Layout;