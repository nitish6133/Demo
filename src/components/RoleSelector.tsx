import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useStudentProfileStore } from '../stores/studentProfileStore';
import { useSchoolProfileStore } from '../stores/schoolProfileStore';
import { ROLES, ROLE_EMOJIS } from '../constants/role';
import { Role } from '../types';

const RoleSelector: React.FC = () => {
  const { futureRole, setFutureRole } = useStudentProfileStore();
  const { profiles: schoolProfiles } = useSchoolProfileStore();
  const [isOpen, setIsOpen] = React.useState(false);

  // Get available professions from school profile
  const schoolProfile = schoolProfiles.length > 0 ? schoolProfiles[0] : null;
  const availableProfessions = schoolProfile?.professions || ROLES;

  const handleRoleSelect = (role: Role) => {
    setFutureRole(role);
    setIsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-md relative"
    >
      <motion.label 
        className="block text-lg font-display font-bold text-pink-600 mb-4"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
          <span className="text-2xl">🌟</span>
          <span>Choose Your Future Career!</span>
        </div>
      </motion.label>
      
      {/* Show message if no professions available */}
      {availableProfessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl text-center"
        >
          <p className="text-yellow-700 font-semibold">
            🏫 No professions available. Please ask your school to set up their profile first!
          </p>
        </motion.div>
      )}
      
      <div className="relative">
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-3xl blur opacity-30"
          animate={{ rotate: [0, -1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={availableProfessions.length === 0}
          className={`relative w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-3 border-pink-200 rounded-3xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-left flex items-center justify-between shadow-fun hover:shadow-rainbow ${
            availableProfessions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {futureRole ? (
              <>
                <motion.span 
                  className="text-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {ROLE_EMOJIS[futureRole as keyof typeof ROLE_EMOJIS] || '🎯'}
                </motion.span>
                <span className="font-bold text-pink-800 text-lg">{futureRole}</span>
              </>
            ) : (
              <span className="text-pink-400 font-bold text-lg">Pick your dream job! 🚀</span>
            )}
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown 
              className={`w-6 h-6 text-pink-500 transition-transform duration-200`} 
            />
          </motion.div>
        </button>
        
        {isOpen && availableProfessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-rainbow z-10 overflow-hidden"
          >
            {availableProfessions.map((role) => (
              <motion.button
                key={role}
                onClick={() => handleRoleSelect(role as Role)}
                className="w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 flex items-center gap-4 border-b border-pink-100 last:border-b-0"
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {ROLE_EMOJIS[role as keyof typeof ROLE_EMOJIS] || '🎯'}
                </motion.span>
                <span className="font-bold text-pink-800 text-lg">{role}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
      
      {futureRole && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="mt-3"
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full shadow-fun"
            animate={{ 
              boxShadow: [
                "0 4px 20px rgba(255, 182, 193, 0.4)",
                "0 8px 30px rgba(255, 182, 193, 0.6)",
                "0 4px 20px rgba(255, 182, 193, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span 
              className="text-2xl mr-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {ROLE_EMOJIS[futureRole as keyof typeof ROLE_EMOJIS] || '🎯'}
            </motion.span>
            <span className="text-white font-bold text-lg">Future {futureRole}!</span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RoleSelector;