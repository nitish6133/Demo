import React from 'react';
import { motion } from 'framer-motion';
import { Download, Save, ExternalLink, Sparkles } from 'lucide-react';
import { useStudentProfileStore } from '../stores/studentProfileStore';
import { apiService } from '../services/studentImageService';
import { useToast } from './UI/ToastContainer';

const GeneratedImagePreview: React.FC = () => {
  const {
    generatedImageId,
    futureRole,
    childName,
    loading,
    saveProfile,
    currentProfile
  } = useStudentProfileStore();
  console.log("generatedImageId", (generatedImageId as any))

  const { showSuccess, showError } = useToast();


  if (!generatedImageId) return null;

  // Extract the actual image ID from the response
  const actualImageId =
    typeof generatedImageId === 'object' && generatedImageId !== null && 'generatedImageId' in generatedImageId
      ? (generatedImageId as { generatedImageId: string }).generatedImageId
      : generatedImageId;

  const imageUrl = apiService.getGeneratedImageUrl(actualImageId);

  const handleSaveProfile = async () => {
    try {
      await saveProfile();
      showSuccess("Student Profile saved successfully.");
    } catch {
      showError("Failed to save profile.");
    }
  };

  const handleViewImage = () => {
    window.open(imageUrl, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `future-${futureRole}-${childName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mt-8"
    >
      <div className="bg-white rounded-3xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg">Your Future Awaits!</h3>
          </div>
          <p className="text-primary-100">
            Future {futureRole} at {childName}
          </p>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={`Future ${futureRole}`}
            className="w-full h-64 object-cover"
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          {generatedImageId .saved === false ? (
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          ) : (
            <div className="p-3 bg-secondary-100 rounded-xl text-center">
              <p className="text-secondary-700 font-medium">✨ Profile Saved!</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleViewImage}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GeneratedImagePreview;