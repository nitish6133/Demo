import React, { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import { MemberCard } from './MemberCard';
import { AddMemberModal } from './AddMemberModal';
import { ChevronRight, ChevronLeft, Users, Plus } from 'lucide-react';

export const MembersList: React.FC = () => {
  const { people, getHead, setCurrentStep } = useHouseholdStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const head = getHead();
  const members = people.filter(person => !person.isHead);

  const goBack = () => {
    setCurrentStep('head');
  };

  const goNext = () => {
    setCurrentStep('review');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-4 sacred-glow float-animation">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Family Members
        </h2>
        <p className="text-orange-700">
          Add family members and define their relationships to {head?.name || 'the head of family'}
        </p>
      </div>

      {/* Head Display */}
      {head && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 sacred-glow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {head.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-orange-900">{head.name}</h3>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Head of Family
                </span>
              </div>
              {head.nativeName && (
                <p className="text-sm text-orange-700">{head.nativeName}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-orange-900">
            Family Members ({members.length})
          </h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 sacred-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12 bg-orange-50/50 rounded-lg border-2 border-dashed border-orange-300">
            <Users className="mx-auto h-12 w-12 text-orange-400 mb-4" />
            <h3 className="text-lg font-medium text-orange-900 mb-2">No family members yet</h3>
            <p className="text-orange-600 mb-4">Add family members to create relationships</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 sacred-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {members.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={goBack}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-orange-300 text-base font-medium rounded-lg text-orange-700 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 sacred-glow"
        >
          Continue to Review
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};