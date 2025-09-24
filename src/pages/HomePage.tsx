import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import SchoolInput from '../components/SchoolInput';
import RoleSelector from '../components/RoleSelector';
import ImageUploader from '../components/ImageUploader';
import GenerateButton from '../components/GenerateButton';
import GeneratedImagePreview from '../components/GeneratedImagePreview';
import CartoonBackground from '../components/CartoonBackground';
import { useStudentProfileStore } from '../stores/studentProfileStore';
import { useSchoolProfileStore } from '../stores/schoolProfileStore';
import Layout from '../components/Layout/Layout';


const HomePage: React.FC = () => {
  const { error, setError, generatedImageId, futureRole, fetchProfiles } = useStudentProfileStore();
  const { fetchSchoolProfile } = useSchoolProfileStore();

  React.useEffect(() => {
    // Clear any existing errors when component mounts
    setError(null);
    // Fetch profiles to update navbar counts
    fetchProfiles();
    // Fetch school profile to get available professions
    fetchSchoolProfile();
  }, [setError]);



  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <CartoonBackground role={futureRole} variant="home" />

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-rainbow text-white">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"
            animate={{
              background: [
                "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2), rgba(59, 130, 246, 0.2))",
                "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2))",
                "linear-gradient(to right, rgba(219, 39, 119, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="relative container mx-auto px-4 pt-20 sm:pt-24 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  className="p-3 sm:p-4 bg-white/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-fun"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
                </motion.div>
                <motion.h1
                  className="text-3xl sm:text-5xl md:text-7xl font-bold font-display"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Future Citizen
                </motion.h1>
              </div>

            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 sm:w-60 h-40 sm:h-60 bg-white/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-60 sm:w-80 h-60 sm:h-80 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        {/* Main content */}
        <div className="relative container mx-auto px-4 py-12">
          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mb-8"
            >
              <motion.div
                className="bg-gradient-to-r from-red-100 to-pink-100 border-3 border-red-300 rounded-3xl p-6 text-red-700 text-center shadow-fun"
                animate={{
                  boxShadow: [
                    "0 4px 20px rgba(239, 68, 68, 0.2)",
                    "0 8px 30px rgba(239, 68, 68, 0.4)",
                    "0 4px 20px rgba(239, 68, 68, 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="font-bold text-lg">🚨 {error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-3 px-4 py-2 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors duration-200"
                >
                  Got it! ✅
                </button>
              </motion.div>
            </motion.div>
          )}

          <div className="flex flex-col items-center space-y-8">
            {/* Form steps */}
            <div className="w-full max-w-4xl">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-fun"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    1
                  </motion.div>
                  <h3 className="font-bold text-purple-700 mb-2 text-xl">🏫 Enter School</h3>
                  <p className="text-base text-purple-600 font-semibold">Tell us your awesome school!</p>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-3xl flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-fun"
                    animate={{
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    2
                  </motion.div>
                  <h3 className="font-bold text-green-700 mb-2 text-xl">🌟 Choose Profession</h3>
                  <p className="text-base text-green-600 font-semibold">Pick your dream job!</p>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-3xl flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-fun"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    3
                  </motion.div>
                  <h3 className="font-bold text-orange-700 mb-2 text-xl">📸 Upload Photo</h3>
                  <p className="text-base text-orange-600 font-semibold">Show us your smile!</p>
                </motion.div>
              </div>
            </div>

            {/* Form inputs */}
            <div className="flex flex-col items-center space-y-8">
              <SchoolInput />

              <motion.div
                className="flex items-center text-purple-500"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>

              <RoleSelector />

              <motion.div
                className="flex items-center text-pink-500"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>

              <ImageUploader />

              <GenerateButton />
            </div>

            {/* Generated image preview */}
            {generatedImageId && <GeneratedImagePreview />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;