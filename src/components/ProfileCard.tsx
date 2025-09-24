import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, School, ExternalLink, Trash2 } from 'lucide-react';
import { Profile } from '../types';
import { ROLE_EMOJIS } from '../constants/role';
import { apiService } from '../services/studentImageService';
import { formatBackendDateForDisplay } from '../utils/dateUtils';
import { useStudentProfileStore } from '../stores/studentProfileStore';

interface ProfileCardProps {
  profile: Profile;
  index: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, index }) => {
  const imageUrl = apiService.getGeneratedImageUrl(profile?.generatedImageId);
  const { deleteProfile, loading } = useStudentProfileStore();

  const handleViewImage = () => {
    window.open(imageUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-200 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Future ${profile?.futureRole}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Role badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-800">
            Future {ROLE_EMOJIS[profile?.futureRole as keyof typeof ROLE_EMOJIS]}{" "}
            {profile?.futureRole?.charAt(0).toUpperCase() + profile?.futureRole?.slice(1)}
          </span>
        </div>

        {/* Action buttons (View + Delete) */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* View */}
          <button
            onClick={handleViewImage}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </button>

          {/* Delete */}
          <motion.button
            onClick={() => deleteProfile(profile.id)}
            disabled={loading}
            className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-text-primary mb-3">
          {profile?.childName}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <School className="w-4 h-4 text-primary-500" />
            <span>{profile?.schoolName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 text-secondary-500" />
            <span>
              {profile?.createdAt
                ? formatBackendDateForDisplay(profile.createdAt)
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
