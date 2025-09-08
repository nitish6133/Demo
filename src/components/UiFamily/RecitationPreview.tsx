import React, { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import { ChevronLeft, Eye, FileText, Play, Download } from 'lucide-react';
import { RELATION_LABELS } from '../../types/household';

export const RecitationPreview: React.FC = () => {
  const { 
    gotram, 
    gotramPhonetic, 
    familyDisplayName, 
    getRecitationOrder, 
    relationships, 
    getHead,
    setCurrentStep 
  } = useHouseholdStore();
  
  const [showJson, setShowJson] = useState(false);
  const recitationOrder = getRecitationOrder();
  const head = getHead();

  const generateRecitation = () => {
    if (!head) return '';

    let recitation = `For the ${familyDisplayName || 'family'} of ${gotram} gotram`;
    
    if (gotramPhonetic) {
      recitation += ` (pronounced: ${gotramPhonetic})`;
    }
    
    recitation += ':\n\n';

    recitationOrder.forEach((person, index) => {
      const relation = relationships.find(r => r.fromPersonId === person.id);
      const relationLabel = person.isHead ? 'Head of Family' : (relation ? RELATION_LABELS[relation.kind] : 'Member');
      
      recitation += `${index + 1}. ${person.name}`;
      
      recitation += ` - ${relationLabel}`;
      
      
      recitation += '\n';
    });

    return recitation;
  };

  const generateJsonPayload = () => {
    return {
      familyDisplayName,
      gotram,
      gotramPhonetic,
      people: recitationOrder,
      relationships: relationships
    };
  };

  const goBack = () => {
    setCurrentStep('pronunciation');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Eye className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Final Review & Recitation Preview
        </h2>
        <p className="text-gray-600">
          Review how your family will be presented during puja ceremonies
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{recitationOrder.length}</div>
          <div className="text-sm text-blue-800">Family Members</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{gotram}</div>
          <div className="text-sm text-purple-800">Gotram</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{relationships.length}</div>
          <div className="text-sm text-green-800">Relationships</div>
        </div>
      </div>

      {/* Recitation Preview */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Play className="w-5 h-5 mr-2 text-orange-600" />
            Puja Recitation Preview
          </h3>
          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            <Download className="w-4 h-4 inline mr-1" />
            Export
          </button>
        </div>
        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
            {generateRecitation()}
          </pre>
        </div>
      </div>

      {/* JSON Payload Toggle */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            Technical Payload
          </h3>
          <button
            onClick={() => setShowJson(!showJson)}
            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
          >
            {showJson ? 'Hide' : 'Show'} JSON
          </button>
        </div>
        
        {showJson && (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-xs font-mono">
              {JSON.stringify(generateJsonPayload(), null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Validation Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-900 mb-2">✅ Validation Complete</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Gotram specified: {gotram}</li>
          <li>• Head of family identified: {head?.name}</li>
          <li>• {recitationOrder.length} family members added</li>
          <li>• {relationships.length} relationships defined</li>
          <li>• Ready for ceremony use</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={goBack}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back to Pronunciation
        </button>
      </div>
    </div>
  );
};