import React, { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import VirtualTryOn from './VirtualTryOn';

interface VirtualTryOnButtonProps {
  productImage: string;
  productName: string;
  className?: string;
}

const VirtualTryOnButton: React.FC<VirtualTryOnButtonProps> = ({ 
  productImage, 
  productName, 
  className = '' 
}) => {
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowVirtualTryOn(true)}
        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 ${className}`}
      >
        <Camera className="h-4 w-4 mr-2" />
        Try On
      </button>

      {/* Virtual Try-On Modal */}
      {showVirtualTryOn && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <VirtualTryOn
            productImage={productImage}
            productName={productName}
            onClose={() => setShowVirtualTryOn(false)}
          />
        </div>
      )}
    </>
  );
};

export default VirtualTryOnButton;