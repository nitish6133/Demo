import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Upload, ArrowRight, School } from 'lucide-react';
import { useBrandingStore } from '../stores/useBrandingStore';
import Footer from './Footer';
import { getLogoUrl } from '../utils/imageUtils';



const BrandingSetup: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, uploadimage, isLoading, loadSettings, submitSchoolProfile } = useBrandingStore();
  console.log("settings", settings)

  // local state mirrors store settings
  const [schoolName, setSchoolName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  // load backend settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // update local state when settings load
  useEffect(() => {
    if (settings) {
      setSchoolName(settings.name || '');
      setTagline(settings.branding.tagline || '');
    }
  }, [settings]);

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create a preview URL and clean up previous
      const previewUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(previewUrl);
    }
  };


  const handleContinue = async () => {
    
const freshSettings = useBrandingStore.getState().settings;

let logoUrl = freshSettings?.branding.logoUrl || null;

const updatedBranding = {
  ...freshSettings?.branding,
  logoUrl,
  tagline: tagline,
  hashTags: freshSettings?.branding.hashTags ?? null, // or null if you want
};

updateSettings({ name: schoolName, branding: updatedBranding });

  await submitSchoolProfile();
  navigate('/teacher');
};



  const handleSkip = () => {
    navigate('/teacher');
  };

  // Get the display logo URL
  const logoDisplayUrl = getLogoUrl(settings?.branding?.logoUrl ?? undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 pb-16">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 rounded-full p-4 w-20 h-20 mx-auto mb-4">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Future Frame</h1>
          <p className="text-gray-600">Let's set up your school's branding</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* School Name */}
          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
              <School className="inline w-4 h-4 mr-1" />
              School Name
            </label>
            <input
              type="text"
              id="schoolName"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your school name"
            />
          </div>

          {/* Tagline */}
          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-2">
              School Tagline
            </label>
            <input
              type="text"
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your school tagline"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline w-4 h-4 mr-1" />
              School Logo (Optional)
            </label>

            {(logoPreviewUrl || logoDisplayUrl) && (
              <div className="mb-4">
                <img
                  src={logoPreviewUrl || logoDisplayUrl}
                  alt="School logo"
                  className="w-24 h-24 object-contain border border-gray-200 rounded-lg mx-auto"
                />
              </div>
            )}


            <div className="flex justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
                id="logo-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition duration-200 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? 'Uploading...' : logoDisplayUrl ? 'Change Logo' : 'Upload Logo'}
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-900 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Preview</h3>
            <div className="flex items-center">
              {logoPreviewUrl || logoDisplayUrl ? (
                <img
                  src={logoPreviewUrl || logoDisplayUrl}
                  alt="Logo"
                  className="w-10 h-10 object-contain bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3"
                />
              ) : (
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3">
                  <School className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h4 className="font-bold">{schoolName || 'Your School Name'}</h4>
                <p className="text-sm opacity-90">{tagline}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition duration-200"
            >
              Skip for Now
            </button>
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default BrandingSetup;