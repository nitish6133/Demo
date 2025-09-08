import React from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import { ChevronRight, ChevronLeft, Volume2, Edit3 } from 'lucide-react';

export const PronunciationPass: React.FC = () => {
  const { gotram, gotramPhonetic, people, setCurrentStep, updateBasics, updatePerson } = useHouseholdStore();

  const goBack = () => {
    setCurrentStep('review');
  };

  const goNext = () => {
    setCurrentStep('final');
  };

  const skip = () => {
    setCurrentStep('final');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Volume2 className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pronunciation Guide
        </h2>
        <p className="text-gray-600">
          Add phonetic hints to help with accurate pronunciation during ceremonies (optional)
        </p>
      </div>

      <div className="space-y-6">
        {/* Gotram Pronunciation */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gotram Pronunciation</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gotram: <span className="font-semibold">{gotram}</span>
              </label>
              <input
                type="text"
                value={gotramPhonetic || ''}
                onChange={(e) => updateBasics({ gotramPhonetic: e.target.value })}
                placeholder="e.g., KASH-ya-pa, bha-RAD-wa-ja"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Use syllable breaks or phonetic spelling</p>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 border border-purple-300 text-purple-700 bg-white rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                <Volume2 className="w-4 h-4 inline mr-2" />
                Record Audio (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Names Pronunciation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Names Pronunciation</h3>
          <div className="space-y-4">
            {people.map((person) => (
              <div key={person.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {person.name} {person.isHead && <span className="text-yellow-600">(Head)</span>}
                      {person.nativeName && <span className="text-gray-500 text-xs block">{person.nativeName}</span>}
                    </label>
                    <input
                      type="text"
                      value={person.phonetic || ''}
                      onChange={(e) => updatePerson(person.id, { phonetic: e.target.value })}
                      placeholder="e.g., NRU-pal, PREE-ya"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                      <Volume2 className="w-4 h-4 inline mr-2" />
                      Record Audio (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <Edit3 className="w-4 h-4 mr-2" />
            Pronunciation Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use capital letters for stressed syllables: "NRU-pal" instead of "nru-pal"</li>
            <li>• Separate syllables with hyphens: "PREE-ya" instead of "Preya"</li>
            <li>• Use familiar sounds: "uh" for अ, "aa" for आ, "ee" for ई</li>
            <li>• These guides will help priests and family pronounce names correctly</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={goBack}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back to Review
        </button>
        <button
          type="button"
          onClick={skip}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Continue to Final Review
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};