import React, { useState } from 'react';
import { Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useHouseholdStore } from '../../stores/householdStore';
import { useToast } from '../UI/ToastContainer';
import { useNavigate } from 'react-router-dom';

export const SaveBar: React.FC = () => {
  const { currentStep, validateHousehold, saveHousehold, resetForm, exportToBookingFormat } = useHouseholdStore();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBookingOption, setShowBookingOption] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const errors = validateHousehold();
      if (Object.keys(errors).length > 0) {
        setError('Please fix validation errors before saving');
        showError('Validation Error', 'Please fix all validation errors before saving');
        return;
      }

      const id = await saveHousehold();
      setSavedId(id);
      setShowBookingOption(true);
      showSuccess('Household Saved', 'Your family household has been registered successfully!');
      
      setTimeout(() => {
        setSavedId(null);
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save household';
      setError(errorMessage);
      showError('Save Failed', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceedToBooking = () => {
    // Export household data to booking format and navigate
    const bookingData = exportToBookingFormat();
    
    // Store in session storage for booking page to pick up
    sessionStorage.setItem('household-booking-data', JSON.stringify(bookingData));
    
    navigate('/booking');
  };
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      resetForm();
      setSavedId(null);
      setError(null);
      setShowBookingOption(false);
    }
  };

  if (currentStep === 'basics') return null;

  return (
    <div className="mt-6 glass-card border-t border-orange-200 shadow-lg">

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
            {savedId && (
              <div className="flex items-center text-green-600 text-sm">
                <Check className="w-4 h-4 mr-1" />
                Saved successfully! ID: {savedId}
              </div>
            )}
            {showBookingOption && (
              <div className="flex items-center text-blue-600 text-sm">
                <Check className="w-4 h-4 mr-1" />
                Ready to book puja with this family data
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {showBookingOption && (
              <button
                onClick={handleProceedToBooking}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-transparent rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                Book Puja with This Family
              </button>
            )}
            
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-orange-700 bg-white/80 border border-orange-300 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Reset Form
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 border border-transparent rounded-lg hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 sacred-glow"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Household
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};