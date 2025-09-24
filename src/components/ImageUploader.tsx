import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import { useStudentProfileStore } from '../stores/studentProfileStore';

const ImageUploader: React.FC = () => {
  const { childImagePreview, setChildImage } = useStudentProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChildImage(file);
    }
  };

  const handleRemoveImage = () => {
    if (childImagePreview) {
      URL.revokeObjectURL(childImagePreview);
    }
    setChildImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-md relative"
    >
      <motion.label 
        className="block text-lg font-display font-bold text-blue-600 mb-4"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ImageIcon className="w-6 h-6 text-blue-500" />
          </motion.div>
          <span className="text-2xl">📸</span>
          <span>Show Us Your Awesome Face!</span>
        </div>
      </motion.label>
      
      {!childImagePreview ? (
        <div className="space-y-3">
          {/* Upload from device */}
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 border-3 border-dashed border-blue-300 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group shadow-fun hover:shadow-rainbow"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div 
                className="p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300 shadow-fun"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-center">
                <p className="font-bold text-blue-700 text-xl">📱 Upload from Device</p>
                <p className="text-base text-blue-600 mt-2 font-semibold">Pick your best photo! ✨</p>
              </div>
            </div>
          </motion.button>
          
          {/* Camera capture */}
          <motion.button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full p-8 border-3 border-dashed border-green-300 rounded-3xl bg-gradient-to-br from-green-50 to-yellow-50 hover:from-green-100 hover:to-yellow-100 transition-all duration-300 group shadow-fun hover:shadow-rainbow"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div 
                className="p-4 bg-gradient-to-br from-green-400 to-yellow-500 rounded-2xl group-hover:from-green-500 group-hover:to-yellow-600 transition-all duration-300 shadow-fun"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-center">
                <p className="font-bold text-green-700 text-xl">📷 Take Photo</p>
                <p className="text-base text-green-600 mt-2 font-semibold">Say cheese! 😄</p>
              </div>
            </div>
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-rainbow border-4 border-white"
            animate={{ 
              boxShadow: [
                "0 8px 32px rgba(139, 92, 246, 0.3)",
                "0 12px 40px rgba(139, 92, 246, 0.5)",
                "0 8px 32px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <img
              src={childImagePreview}
              alt="Child preview"
              className="w-full h-56 object-cover"
            />
            
            <motion.button
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 p-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full hover:from-red-500 hover:to-pink-600 transition-all duration-300 shadow-fun"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-purple-600 font-bold text-center"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌟 You look amazing! Ready to see your future? 🚀
            </motion.span>
          </motion.p>
        </motion.div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
};

export default ImageUploader;