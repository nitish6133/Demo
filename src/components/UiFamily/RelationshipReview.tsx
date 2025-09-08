import React from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import { ChevronRight, ChevronLeft, Network, Crown, Heart, Users, User } from 'lucide-react';
import { RELATION_LABELS } from '../../types/household';

export const RelationshipReview: React.FC = () => {
  const { people, relationships, getHead, setCurrentStep } = useHouseholdStore();
  
  const head = getHead();

  const getGroupedMembers = () => {
    if (!head) return { spouses: [], children: [], parents: [], others: [] };

    const spouses = relationships
      .filter(rel => rel.toPersonId === head.id && rel.kind === 'spouse')
      .map(rel => people.find(p => p.id === rel.fromPersonId))
      .filter(Boolean);

    const children = relationships
      .filter(rel => rel.toPersonId === head.id && (rel.kind === 'son' || rel.kind === 'daughter'))
      .map(rel => ({ 
        person: people.find(p => p.id === rel.fromPersonId),
        relation: rel.kind
      }))
      .filter(item => item.person)
      .sort((a, b) => {
        // Sort by date of birth if available
        if (a.person?.dateOfBirth && b.person?.dateOfBirth) {
          return new Date(a.person.dateOfBirth).getTime() - new Date(b.person.dateOfBirth).getTime();
        }
        // Otherwise sort sons before daughters
        if (a.relation === 'son' && b.relation === 'daughter') return -1;
        if (a.relation === 'daughter' && b.relation === 'son') return 1;
        return 0;
      });

    const parents = relationships
      .filter(rel => rel.toPersonId === head.id && (rel.kind === 'father' || rel.kind === 'mother'))
      .map(rel => ({ 
        person: people.find(p => p.id === rel.fromPersonId),
        relation: rel.kind
      }))
      .filter(item => item.person)
      .sort((a, b) => a.relation === 'father' ? -1 : 1); // Father first

    const usedIds = new Set([
      head.id,
      ...spouses.map(s => s?.id).filter(Boolean),
      ...children.map(c => c.person?.id).filter(Boolean),
      ...parents.map(p => p.person?.id).filter(Boolean)
    ]);

    const others = people
      .filter(person => !usedIds.has(person.id))
      .map(person => {
        const rel = relationships.find(r => r.fromPersonId === person.id && r.toPersonId === head.id);
        return { person, relation: rel?.kind || 'other' };
      });

    return { spouses, children, parents, others };
  };

  const { spouses, children, parents, others } = getGroupedMembers();

  const goBack = () => {
    setCurrentStep('members');
  };

  const goNext = () => {
    setCurrentStep('pronunciation');
  };

  const MemberItem = ({ person, relation, icon }: { person: any; relation: string; icon: React.ReactNode }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{person.name}</span>
          <span className="text-sm text-gray-500">({RELATION_LABELS[relation]})</span>
        </div>
        {person.nativeName && (
          <p className="text-sm text-gray-600">{person.nativeName}</p>
        )}
        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
          <span className="capitalize">{person.gender}</span>
          {person.dateOfBirth && (
            <span>{new Date(person.dateOfBirth).getFullYear()}</span>
          )}
          {person.phonetic && (
            <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
              {person.phonetic}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Network className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Relationship Review
        </h2>
        <p className="text-gray-600">
          Review the family structure and relationships
        </p>
      </div>

      <div className="space-y-6">
        {/* Head of Family */}
        {head && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-600" />
              Head of Family
            </h3>
            <MemberItem 
              person={head} 
              relation="self" 
              icon={
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              }
            />
          </div>
        )}

        {/* Spouses */}
        {spouses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-600" />
              Spouse{spouses.length > 1 ? 's' : ''}
            </h3>
            <div className="space-y-2">
              {spouses.map((spouse) => (
                <MemberItem 
                  key={spouse?.id}
                  person={spouse} 
                  relation="spouse" 
                  icon={
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Children */}
        {children.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Children
            </h3>
            <div className="space-y-2">
              {children.map((child, index) => (
                <MemberItem 
                  key={child.person?.id}
                  person={child.person} 
                  relation={child.relation} 
                  icon={
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{index + 1}</span>
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Parents */}
        {parents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Parents
            </h3>
            <div className="space-y-2">
              {parents.map((parent) => (
                <MemberItem 
                  key={parent.person?.id}
                  person={parent.person} 
                  relation={parent.relation} 
                  icon={
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Others */}
        {others.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-600" />
              Other Relations
            </h3>
            <div className="space-y-2">
              {others.map((other) => (
                <MemberItem 
                  key={other.person?.id}
                  person={other.person} 
                  relation={other.relation} 
                  icon={
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={goBack}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back to Members
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Continue to Pronunciation
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};