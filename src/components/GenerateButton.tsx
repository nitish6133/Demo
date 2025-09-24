import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2 } from 'lucide-react';
import { useStudentProfileStore } from '../stores/studentProfileStore';

const GenerateButton: React.FC = () => {
  const { 
    childName, 
    futureRole, 
    childImageFile, 
    childImageId,
    loading, 
    uploadFile, 
    generateFutureRoleImage 
  } = useStudentProfileStore();

  const isReady = childName && futureRole && childImageFile;
  
  const handleGenerate = async () => {
    if (!isReady) return;
    
    try {
      // Upload file if not already uploaded
      if (!childImageId) {
        await uploadFile();
      }
      
      // Generate the future role image
      await generateFutureRoleImage();
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full max-w-md mt-8"
    >
      <motion.button
        onClick={handleGenerate}
        disabled={!isReady || loading}
        className={`w-full py-6 px-8 rounded-3xl font-display font-bold text-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-rainbow ${
          isReady && !loading
            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white'
            : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
        }`}
        whileHover={isReady && !loading ? { 
          scale: 1.05, 
          y: -3,
          boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
        } : {}}
        whileTap={isReady && !loading ? { scale: 0.95 } : {}}
        animate={isReady && !loading ? {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        } : {}}
        transition={{
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        style={{
          backgroundSize: "200% 200%"
        }}
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8" />
            </motion.div>
            <span>🎨 Creating Magic...</span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wand2 className="w-8 h-8" />
            </motion.div>
            <span>✨ Generate My Future! 🚀</span>
          </>
        )}
      </motion.button>
      
      {!isReady && !loading && (
        <motion.p 
          className="mt-4 text-lg text-purple-600 font-bold text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌈 Fill in everything above to start the magic! ✨
        </motion.p>
      )}
      
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-fun"
            animate={{ 
              boxShadow: [
                "0 4px 20px rgba(139, 92, 246, 0.2)",
                "0 8px 30px rgba(139, 92, 246, 0.4)",
                "0 4px 20px rgba(139, 92, 246, 0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
            <span className="text-lg font-bold text-purple-700">
              🎭 Creating your amazing future...
            </span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GenerateButton;