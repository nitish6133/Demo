import React, { useState } from 'react';
import { Camera, Sparkles, Star, Users } from 'lucide-react';
import VirtualTryOnButton from './VirtualTryOnButton';

interface TryOnFeatureProps {
  productImage: string;
  productName: string;
}

const TryOnFeature: React.FC<TryOnFeatureProps> = ({ productImage, productName }) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg mr-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Virtual Try-On</h3>
              <p className="text-sm text-gray-600">See how this jewelry looks on you</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">Upload your photo</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">Auto-positioning</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">Realistic preview</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Our AI-powered virtual try-on technology automatically detects your face and hands to position 
            jewelry perfectly. You can also manually adjust size, position, and rotation for the perfect fit.
          </p>
        </div>

        <div className="ml-6">
          <VirtualTryOnButton
            productImage={productImage}
            productName={productName}
            className="px-6 py-3 text-base"
          />
        </div>
      </div>

      {/* Demo Preview */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
        >
          {showDemo ? 'Hide' : 'Show'} how it works
        </button>
        
        {showDemo && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 text-center">1. Upload your photo</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="w-full h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 text-center">2. AI positions jewelry</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="w-full h-24 bg-green-100 rounded-lg mb-2 flex items-center justify-center">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 text-center">3. See realistic preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOnFeature;