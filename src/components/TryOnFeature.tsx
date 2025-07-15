import React, { useState, useRef } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import VirtualTryOn from './VirtualTryOn';

interface TryOnFeatureProps {
  productImage: string;
  productName: string;
}

const TryOnFeature: React.FC<TryOnFeatureProps> = ({ productImage, productName }) => {
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mt-6 border border-purple-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 rounded-full p-3">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Virtual Try-On
          </h3>
          <p className="text-gray-600 mb-6">
            See how this {productName.toLowerCase()} looks on you with our advanced virtual try-on technology
          </p>
          
          <button
            onClick={() => setShowVirtualTryOn(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Try It On Now
          </button>
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Auto-positioning
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Realistic scaling
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Mobile friendly
            </div>
          </div>
        </div>
      </div>

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

export default TryOnFeature;