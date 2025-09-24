import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import CartoonBackground from '../components/CartoonBackground';
import { useStudentProfileStore } from '../stores/studentProfileStore';
import Layout from '../components/Layout/Layout';

const ProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, loading, fetchProfiles, deleteAllProfiles } = useStudentProfileStore();


  React.useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);


  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <CartoonBackground variant="profiles" />

        {/* Header */}
        <div
          className="
    container mx-auto px-4 
    pt-20 sm:pt-20 pb-12  
    sm:pt-8 sm:pb-8       
  "
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            {/* Left side (Back + Saved Profiles) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-4"
            >
              {/* Back button */}
              <motion.button
                onClick={() => navigate('/')}
                className="p-2 sm:p-3 bg-white/30 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/40 transition-all duration-300 shadow-fun"
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>

              {/* Title */}
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  className="p-2 sm:p-3 bg-white/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-fun"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                </motion.div>
                <div>
                  <motion.h2
                    className="text-lg sm:text-3xl md:text-5xl font-bold font-display"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(255,255,255,0.5)",
                        "0 0 30px rgba(255,255,255,0.8)",
                        "0 0 20px rgba(255,255,255,0.5)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Saved Profiles
                  </motion.h2>
                </div>
              </div>
            </motion.div>



           <div className='flex gap-2'>
             {/* Delete All button */}
            {profiles.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => deleteAllProfiles(profiles[0].schoolId)} // assuming all belong to same school
                disabled={loading}
                className="
      flex items-center gap-2
      px-4 py-2 
      bg-red-500 text-white text-sm font-semibold
      rounded-lg sm:rounded-xl
      hover:bg-red-600 transition-all duration-300 shadow-fun
    "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All Profiles</span>
              </motion.button>
            )}

            {/* Right side (Refresh button) */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => fetchProfiles()}
              disabled={loading}
              className="p-3 sm:p-4 bg-white/30 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/40 transition-all duration-300 shadow-fun self-start sm:self-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-5 h-5 sm:w-6 sm:h-6 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
           </div>
          </div>
        </div>


        {/* Content */}
        <div className="relative container mx-auto px-4 py-12">
          {loading && profiles?.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                className="inline-flex items-center gap-4 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-3xl shadow-rainbow"
                animate={{
                  boxShadow: [
                    "0 8px 32px rgba(139, 92, 246, 0.3)",
                    "0 12px 40px rgba(139, 92, 246, 0.5)",
                    "0 8px 32px rgba(139, 92, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
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
                <span className="text-purple-700 font-bold text-xl">🎭 Loading amazing profiles...</span>
              </motion.div>
            </div>
          ) : profiles?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  className="p-8 bg-white/90 backdrop-blur-sm rounded-4xl shadow-rainbow"
                  animate={{
                    boxShadow: [
                      "0 8px 32px rgba(139, 92, 246, 0.3)",
                      "0 12px 40px rgba(139, 92, 246, 0.5)",
                      "0 8px 32px rgba(139, 92, 246, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Users className="w-10 h-10 text-purple-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">
                    No Profiles Yet
                  </h3>
                  <p className="text-purple-600 mb-8 text-lg font-semibold">
                    🌟 Start creating your amazing future role profiles! Generate your first superhero now! 🚀
                  </p>
                  <motion.button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-fun"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✨ Create First Profile! 🎨
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles?.map((profile, index) => (
                <ProfileCard
                  key={profile?.id}
                  profile={profile}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilesPage;