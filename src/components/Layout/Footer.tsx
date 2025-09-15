import React from 'react';
import { Mail, FileText, Shield, XCircle, Cookie } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectConfig } from '../../hooks/useProjectConfig';

const Footer: React.FC = () => {
  const { projectName, companyName, companyLogo, theme } = useProjectConfig();

  return (
    <footer 
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary[900]}, ${theme.colors.secondary[900]}, ${theme.colors.primary[900]})`
      }}
    >
      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${theme.colors.primary[600]}30, ${theme.colors.accent[600]}30, ${theme.colors.secondary[600]}30)`
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
        {/* Company Info */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-rainbow border border-white/30">
          <h3 className="text-lg sm:text-xl font-bold font-display text-white drop-shadow-lg mb-3">
            {projectName}
          </h3>
          <p className="text-sm sm:text-base font-semibold text-gray-200 drop-shadow">
            A modern, dynamic application built with cutting-edge technology.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-rainbow border border-white/30">
          <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-lg mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 font-semibold text-sm sm:text-base">
            <li><a href="/" className="text-gray-200 hover:text-pink-300 drop-shadow transition-colors">Home</a></li>
            <li><a href="/login" className="text-gray-200 hover:text-pink-300 drop-shadow transition-colors">Login</a></li>
            <li><a href="/register" className="text-gray-200 hover:text-pink-300 drop-shadow transition-colors">Register</a></li>
            <li><a href="/profile" className="text-gray-200 hover:text-pink-300 drop-shadow transition-colors">Profile</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-rainbow border border-white/30">
          <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-lg mb-3">
            Support
          </h3>
          <ul className="space-y-2 font-semibold text-gray-200 text-sm sm:text-base">
            <li className="flex items-center gap-2 drop-shadow hover:text-pink-300 transition-colors cursor-pointer">
              <Mail className="w-4 h-4 text-pink-400" /> Contact Us
            </li>
            <li className="flex items-center gap-2 drop-shadow hover:text-purple-300 transition-colors cursor-pointer">
              <FileText className="w-4 h-4 text-purple-400" /> Shipping Policy
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-rainbow border border-white/30">
          <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-lg mb-3">
            Legal
          </h3>
          <ul className="space-y-2 font-semibold text-gray-200 text-sm sm:text-base">
            <li className="flex items-center gap-2 drop-shadow hover:text-blue-300 transition-colors cursor-pointer">
              <Shield className="w-4 h-4 text-blue-400" /> Terms & Conditions
            </li>
            <li className="flex items-center gap-2 drop-shadow hover:text-pink-300 transition-colors cursor-pointer">
              <Shield className="w-4 h-4 text-pink-400" /> Privacy Policy
            </li>
            <li className="flex items-center gap-2 drop-shadow hover:text-purple-300 transition-colors cursor-pointer">
              <XCircle className="w-4 h-4 text-purple-400" /> Cancellation Policy
            </li>
            <li className="flex items-center gap-2 drop-shadow hover:text-blue-300 transition-colors cursor-pointer">
              <Cookie className="w-4 h-4 text-blue-400" /> Cookie Settings
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="relative border-t border-white/30 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center text-gray-200 font-semibold text-xs sm:text-sm gap-2 sm:gap-0">
          <span className="drop-shadow text-center sm:text-left">© 2025 Future Citizen. All rights reserved.</span>
          <div className="flex items-center gap-2 drop-shadow text-center">
            <span>Powered by</span>
            <img 
              src={companyLogo} 
              alt={companyName} 
                className="h-6 object-contain"
              />
            <span className="text-white font-bold">{companyName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;