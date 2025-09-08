import React, { useState } from 'react';
import { Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useHouseholdStore } from '../../stores/householdStore';

export const SaveBar: React.FC = () => {
  const { currentStep, validateHousehold, saveHousehold, resetForm } = useHouseholdStore();
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const errors = validateHousehold();
      if (Object.keys(errors).length > 0) {
        setError('Please fix validation errors before saving');
        return;
      }

      const id = await saveHousehold();
      setSavedId(id);
      
      setTimeout(() => {
        setSavedId(null);
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save household');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      resetForm();
      setSavedId(null);
      setError(null);
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
          </div>

          <div className="flex items-center space-x-3">
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