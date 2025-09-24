import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { School, GraduationCap, Save, Plus, Edit, Trash2, Upload, MapPin, X } from "lucide-react";
import { useSchoolProfileStore } from "../stores/schoolProfileStore";
import CartoonBackground from "../components/CartoonBackground";
import Layout from "../components/Layout/Layout";
import { ROLES, ROLE_EMOJIS } from "../constants/role";
import { useToast } from "../components/UI/ToastContainer";
import { apiService } from "../services/studentImageService";

const SchoolProfileForm: React.FC = () => {
  const { 
    profiles, 
    fetchSchoolProfile,
    createSchoolProfile, 
    updateProfile, 
    deleteProfile, 
    loading 
  } = useSchoolProfileStore();
  
  const { showSuccess, showError } = useToast();
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [customProfessions, setCustomProfessions] = useState<string[]>([]);
  const [newProfession, setNewProfession] = useState("");
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null);
  const [schoolLogoPreview, setSchoolLogoPreview] = useState<string | null>(null);
  const [schoolLogoId, setSchoolLogoId] = useState<string | null>(null);
  const [showAllProfessions, setShowAllProfessions] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show first 5 professions initially
  const visibleProfessions = showAllProfessions ? ROLES : ROLES.slice(0, 5);
  const allProfessions = [...ROLES, ...customProfessions];

  // Fetch all school profiles on component mount
  React.useEffect(() => {
    fetchSchoolProfile();
  }, [fetchSchoolProfile]);

  // Set edit mode when profiles are loaded
  React.useEffect(() => {
    if (profiles.length > 0) {
      const profile = profiles[0]; // Use first profile for editing
      setIsEditMode(true);
      setCurrentProfileId(profile.id || null);
      setSchoolName(profile.schoolName);
      setAddress(profile.address || "");
      setSelectedProfessions(profile.professions || []);
      setSchoolLogoId(profile.schoolLogo || null);
      if (profile.schoolLogo) {
        setSchoolLogoPreview(apiService.getImageUrl(profile.schoolLogo));
      }
      
      // Separate custom professions from predefined ones
      const customProfs = (profile.professions || []).filter(prof => !ROLES.includes(prof as any));
      setCustomProfessions(customProfs);
    } else {
      setIsEditMode(false);
      setCurrentProfileId(null);
      setSchoolName("");
      setAddress("");
      setSelectedProfessions([]);
      setCustomProfessions([]);
      setSchoolLogo(null);
      setSchoolLogoPreview(null);
      setSchoolLogoId(null);
    }
  }, [profiles]);

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSchoolLogo(file);
      setSchoolLogoPreview(URL.createObjectURL(file));
      setSchoolLogoId(null); // Clear existing logo ID when new file is selected
    }
  };

  const handleRemoveLogo = () => {
    if (schoolLogoPreview) {
      URL.revokeObjectURL(schoolLogoPreview);
    }
    setSchoolLogo(null);
    setSchoolLogoPreview(null);
    setSchoolLogoId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfessionToggle = (profession: string) => {
    setSelectedProfessions(prev => 
      prev.includes(profession)
        ? prev.filter(p => p !== profession)
        : [...prev, profession]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProfessions([]);
    } else {
      setSelectedProfessions([...allProfessions]);
    }
    setSelectAll(!selectAll);
  };

  const handleAddCustomProfession = () => {
    if (newProfession.trim() && !allProfessions.includes(newProfession.trim())) {
      const profession = newProfession.trim();
      setCustomProfessions(prev => [...prev, profession]);
      setSelectedProfessions(prev => [...prev, profession]);
      setNewProfession("");
    }
  };

  const handleRemoveCustomProfession = (profession: string) => {
    setCustomProfessions(prev => prev.filter(p => p !== profession));
    setSelectedProfessions(prev => prev.filter(p => p !== profession));
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!schoolLogo) return schoolLogoId;
    
    try {
      const logoId = await apiService.uploadFile(schoolLogo);
      return logoId;
    } catch (error) {
      showError("Upload Failed", "Failed to upload school logo. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !address || selectedProfessions.length === 0) return;

    try {
      let logoId = schoolLogoId;
      
      // Upload logo if new file is selected
      if (schoolLogo) {
        logoId = await uploadLogo();
        if (!logoId) return; // Upload failed
      }

      const profileData = {
        schoolName,
        address,
        professions: selectedProfessions,
        schoolLogo: logoId || undefined,
      };

      if (isEditMode && currentProfileId) {
        await updateProfile(currentProfileId, profileData);
        showSuccess("Profile Updated!", "School profile has been updated successfully.");
      } else {
        await createSchoolProfile(profileData);
        showSuccess("Profile Created!", "School profile has been created successfully.");
      }

      // Refresh profiles after create/update
      await fetchSchoolProfile();
    } catch (error) {
      showError("Operation Failed", "Failed to save school profile. Please try again.");
    }
  };


  const handleDelete = async () => {
    if (!currentProfileId) return;

    if (!window.confirm("Are you sure you want to delete this school profile?")) {
      return;
    }

    try {
      await deleteProfile(currentProfileId);
      showSuccess("Profile Deleted!", "School profile has been deleted successfully.");
      
      // Reset form to create mode
      setIsEditMode(false);
      setCurrentProfileId(null);
      setSchoolName("");
      setAddress("");
      setSelectedProfessions([]);
      setCustomProfessions([]);
      setSchoolLogo(null);
      setSchoolLogoPreview(null);
      setSchoolLogoId(null);
      setShowAllProfessions(false);
      
      // Refresh profiles
      await fetchSchoolProfile();
    } catch (error) {
      showError("Delete Failed", "Failed to delete school profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setCurrentProfileId(null);
    setSchoolName("");
    setAddress("");
    setSelectedProfessions([]);
    setCustomProfessions([]);
    setSchoolLogo(null);
    setSchoolLogoPreview(null);
    setSchoolLogoId(null);
    setShowAllProfessions(false);
  };

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <CartoonBackground variant="home" />

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-rainbow">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"
            animate={{
              background: [
                "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2), rgba(59, 130, 246, 0.2))",
                "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2))",
                "linear-gradient(to right, rgba(219, 39, 119, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="relative container mx-auto px-4 pt-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                <motion.div
                  className="p-2 sm:p-3 bg-white/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-fun"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <motion.h1
                  className="text-2xl sm:text-4xl md:text-6xl font-bold font-display text-white"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Build Your School Profile
                </motion.h1>
              </div>
              <motion.p
                className="text-lg sm:text-xl text-white/90 font-bold px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Let's shape the future with your school's dream professions!
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-rainbow border-2 sm:border-3 border-purple-200 overflow-hidden"
              animate={{
                boxShadow: [
                  "0 8px 32px rgba(139, 92, 246, 0.3)",
                  "0 12px 40px rgba(139, 92, 246, 0.5)",
                  "0 8px 32px rgba(139, 92, 246, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
                    School Info
                  </h2>
                  <p className="text-purple-100 font-semibold text-sm sm:text-base">
                    Add your school details and choose professions
                  </p>
                </motion.div>
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-8">
                {/* Current Mode Indicator */}
                {isEditMode && profiles.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-yellow-700 mb-2 flex items-center gap-2">
                          <Edit className="w-5 h-5" />
                          Editing School Profile
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {!isEditMode && profiles.length === 0 && (
                  <div className="mb-6 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                    <h3 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create New School Profile
                    </h3>
                    <p className="text-green-600 text-sm">
                      Fill in the details below to create your school profile
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* School Logo Upload */}
                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-bold text-blue-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>School Logo</span>
                      </div>
                    </label>
                    
                    {!schoolLogoPreview ? (
                      <motion.button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 border-3 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Upload className="w-8 h-8 text-blue-500" />
                          <div className="text-center">
                            <p className="font-bold text-blue-700">Upload School Logo</p>
                            <p className="text-sm text-blue-600">Click to select image</p>
                          </div>
                        </div>
                      </motion.button>
                    ) : (
                      <div className="relative">
                        <img
                          src={schoolLogoPreview}
                          alt="School logo preview"
                          className="w-full h-32 object-contain bg-gray-50 rounded-2xl border-2 border-blue-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      className="hidden"
                    />
                  </div>

                  {/* School Name */}
                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-bold text-purple-700 mb-2">
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>School Name</span>
                        {isEditMode && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Editing
                          </span>
                        )}
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl sm:rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, 1, -1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Enter your school name"
                        className="relative w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-purple-800 placeholder-purple-400 font-semibold text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-bold text-green-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Address</span>
                      </div>
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl sm:rounded-2xl blur opacity-30"
                        animate={{ rotate: [0, -1, 1, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter school address"
                        rows={3}
                        className="relative w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-green-200 rounded-xl sm:rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-green-800 placeholder-green-400 font-semibold text-sm sm:text-base resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Profession Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-base sm:text-lg font-bold text-pink-700 mb-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Select Professions</span>
                        </div>
                      </label>
                      
                      {/* Select All/Unselect All */}
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
                      >
                        {selectAll ? 'Unselect All' : 'Select All'}
                      </button>
                    </div>
                    
                    {/* Selected count */}
                    {selectedProfessions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-2 rounded-xl"
                      >
                        ✅ {selectedProfessions.length} profession{selectedProfessions.length !== 1 ? 's' : ''} selected
                      </motion.div>
                    )}

                    {/* Add Custom Profession */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProfession}
                        onChange={(e) => setNewProfession(e.target.value)}
                        placeholder="Add custom profession (e.g., Software Engineer)"
                        className="flex-1 px-3 py-2 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-orange-800 placeholder-orange-400 font-semibold text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomProfession())}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomProfession}
                        disabled={!newProfession.trim()}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Profession Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Predefined Professions */}
                      {visibleProfessions.map((profession) => (
                        <motion.button
                          key={profession}
                          type="button"
                          onClick={() => handleProfessionToggle(profession)}
                          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 font-semibold text-sm sm:text-base ${
                            selectedProfessions.includes(profession)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-fun'
                              : 'bg-white border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.span 
                            className="text-xl sm:text-2xl"
                            animate={selectedProfessions.includes(profession) ? { 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {ROLE_EMOJIS[profession as keyof typeof ROLE_EMOJIS]}
                          </motion.span>
                          <span className="flex-1 text-left">{profession}</span>
                          {selectedProfessions.includes(profession) && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-lg"
                            >
                              ✅
                            </motion.span>
                          )}
                        </motion.button>
                      ))}

                      {/* Custom Professions */}
                      {customProfessions.map((profession) => (
                        <motion.div
                          key={profession}
                          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 font-semibold text-sm sm:text-base ${
                            selectedProfessions.includes(profession)
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400 shadow-fun'
                              : 'bg-white border-orange-200 text-orange-700 hover:border-orange-400 hover:bg-orange-50'
                          }`}
                        >
                          <span className="text-xl sm:text-2xl">🎯</span>
                          <span className="flex-1 text-left">{profession}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleProfessionToggle(profession)}
                              className="text-lg"
                            >
                              {selectedProfessions.includes(profession) ? '✅' : '⭕'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomProfession(profession)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}

                      {/* Show More/Less Button */}
                      {ROLES.length > 5 && (
                        <motion.button
                          type="button"
                          onClick={() => setShowAllProfessions(!showAllProfessions)}
                          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${showAllProfessions ? 'rotate-45' : ''}`} />
                          <span>
                            {showAllProfessions ? 'Show Less' : `Show All (${ROLES.length - 5} more)`}
                          </span>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !schoolName || !address || selectedProfessions.length === 0}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-fun ${
                      !loading && schoolName && address && selectedProfessions.length > 0
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    whileHover={
                      !loading && schoolName && address && selectedProfessions.length > 0
                        ? {
                            scale: 1.02,
                            y: -2,
                            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)",
                          }
                        : {}
                    }
                    whileTap={!loading && schoolName && address && selectedProfessions.length > 0 ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <>{isEditMode ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Creating...</span>
                        </>
                      )}</>
                    ) : (
                      <>{isEditMode ? (
                        <>
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Update Profile</span>
                        </>
                      ) : (
                        <>
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Create Profile</span>
                        </>
                      )}</>
                    )}
                  </motion.button>

                  {/* Cancel Edit Button */}
                  {isEditMode && (
                    <motion.button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 bg-gray-500 hover:bg-gray-600 text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel Edit
                    </motion.button>
                  )}
                </form>

              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SchoolProfileForm;