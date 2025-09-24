import React from 'react';
import { motion } from 'framer-motion';
import { School } from 'lucide-react';
import { useStudentProfileStore } from '../stores/studentProfileStore';
import { useSchoolProfileStore } from '../stores/schoolProfileStore';
import { apiService } from '../services/studentImageService';

const SchoolInput: React.FC = () => {
  const { childName, setChildName } = useStudentProfileStore();
  const { profiles: schoolProfiles } = useSchoolProfileStore();
  
  const schoolProfile = schoolProfiles.length > 0 ? schoolProfiles[0] : null;

  return (
    <div className="w-full max-w-md space-y-6">
      {/* School Info Display */}
      {schoolProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-fun border-3 border-blue-200"
        >
          <div className="text-center space-y-4">
            {/* School Logo */}
            {schoolProfile.schoolLogo && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex justify-center"
              >
                <img
                  src={apiService.getImageUrl(schoolProfile.schoolLogo)}
                  alt="School Logo"
                  className="w-16 h-16 object-contain rounded-2xl border-2 border-blue-300 bg-white p-2"
                />
              </motion.div>
            )}
            
            {/* School Name */}
            <motion.h3
              className="text-xl font-bold text-blue-700"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {schoolProfile.schoolName}
            </motion.h3>
            
            {/* Address */}
            {schoolProfile.address && (
              <p className="text-blue-600 font-semibold text-sm">
                📍 {schoolProfile.address}
              </p>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Child Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <motion.label 
          htmlFor="child-name" 
          className="block text-lg font-display font-bold text-purple-600 mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <School className="w-6 h-6 text-secondary-500" />
            </motion.div>
            <span className="text-2xl">👶</span>
            <span>What's Your Name?</span>
          </div>
        </motion.label>
        
        <div className="relative">
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-3xl blur opacity-30"
            animate={{ rotate: [0, 1, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <input
            id="child-name"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Type your amazing name here! ✨"
            className="relative w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-3 border-purple-200 rounded-3xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-purple-800 placeholder-purple-400 font-bold text-lg shadow-fun"
          />
          
          {childName && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <motion.div 
                className="text-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✅
              </motion.div>
            </motion.div>
          )}
        </div>
        
        {childName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-purple-600 font-bold text-center"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎉 Hello {childName}! Let's explore your future! 🎉
            </motion.span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default SchoolInput;