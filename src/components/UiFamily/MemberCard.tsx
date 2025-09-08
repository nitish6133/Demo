import React, { useState } from 'react';
import { Person, RELATION_LABELS } from '../../types/household';
import { useHouseholdStore } from '../../stores/householdStore';
import { Edit2, Trash2, User } from 'lucide-react';

interface MemberCardProps {
  member: Person;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const { relationships, removePerson, getHead } = useHouseholdStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const head = getHead();
  const memberRelationships = relationships.filter(rel => rel.fromPersonId === member.id);
  
  const getRelationshipLabel = () => {
    const rel = memberRelationships.find(r => r.toPersonId === head?.id);
    return rel ? RELATION_LABELS[rel.kind] : 'Unknown';
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
      removePerson(member.id);
    }
  };

  const getRoleColor = (relation: string) => {
    const colors: Record<string, string> = {
      'Spouse': 'bg-pink-100 text-pink-800',
      'Son': 'bg-blue-100 text-blue-800',
      'Daughter': 'bg-purple-100 text-purple-800',
      'Father': 'bg-green-100 text-green-800',
      'Mother': 'bg-green-100 text-green-800',
      'Brother': 'bg-indigo-100 text-indigo-800',
      'Sister': 'bg-indigo-100 text-indigo-800',
    };
    return colors[relation] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(getRelationshipLabel())}`}>
                {getRelationshipLabel()}
              </span>
            </div>
            
            {member.nativeName && (
              <p className="text-sm text-gray-600">{member.nativeName}</p>
            )}
            
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <span className="capitalize">{member.gender}</span>
              {member.dateOfBirth && (
                <span>{new Date(member.dateOfBirth).toLocaleDateString()}</span>
              )}
              {member.phonetic && (
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {member.phonetic}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit member"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Remove member"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {member.notes && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
          <strong>Notes:</strong> {member.notes}
        </div>
      )}
    </div>
  );
};