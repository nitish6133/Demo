import React from 'react';
import { HouseholdBasicsSection } from './HouseholdBasicsSection';
import { HeadOfFamilyCard } from './HeadOfFamilyCard';
import { MembersList } from './MembersList';
import { RelationshipReview } from './RelationshipReview';
import { PronunciationPass } from './PronunciationPass';
import { RecitationPreview } from './RecitationPreview';
import { StepIndicator } from './StepIndicator';
import AiPujariLogoform  from '../../../public/images/ai-pujari-logo.ico' 
import { useHouseholdStore } from '../../stores/householdStore';
import { SaveBar } from './SaveBar';
import { useEffect } from 'react';
import { useToast } from '../UI/ToastContainer';

const STEPS = [
  { key: 'basics', label: 'Household Basics', description: 'Gotram and family details' },
  { key: 'head', label: 'Head of Family', description: 'Add the primary person' },
  { key: 'members', label: 'Add Members', description: 'Family members and relationships' },
  { key: 'review', label: 'Review', description: 'Check relationships' },
  { key: 'pronunciation', label: 'Pronunciation', description: 'Add phonetic hints (optional)' },
  { key: 'final', label: 'Final Review', description: 'Confirm and save' }
] as const;

export const HouseholdForm: React.FC = () => {
  const { currentStep, loadUserHousehold } = useHouseholdStore();
  const { showSuccess } = useToast();

  // Load existing household data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadUserHousehold();
        // Check if data was loaded (user has existing household)
        const state = useHouseholdStore.getState();
        if (state.people.length > 0) {
          showSuccess('Household Loaded', 'Your existing household data has been loaded for editing');
        }
      } catch (error) {
        console.log('No existing household data found');
      }
    };
    loadData();
  }, [loadUserHousehold, showSuccess]);

  const renderStep = () => {
    switch (currentStep) {
      case 'basics':
        return <HouseholdBasicsSection />;
      case 'head':
        return <HeadOfFamilyCard />;
      case 'members':
        return <MembersList />;
      case 'review':
        return <RelationshipReview />;
      case 'pronunciation':
        return <PronunciationPass />;
      case 'final':
        return <RecitationPreview />;
      default:
        return <HouseholdBasicsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-ivory to-orange-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6 sacred-glow float-animation">
            <span className="text-3xl">
              <img src={AiPujariLogoform} alt="" />
            </span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Family Household Registration
          </h1>
          <p className="text-lg text-orange-800">
            Create a comprehensive family record for puja ceremonies
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Main Content */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-8">
            {renderStep()}
          </div>
        </div>

        {/* Save Bar */}
        <SaveBar />
      </div>
    </div>
  );
};