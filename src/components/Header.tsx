import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, backTo = '/', actions }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary text-white p-4 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={() => navigate(backTo)}
              className="p-2 hover:bg-green-700 rounded mr-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    </div>
  );
};

export default Header;