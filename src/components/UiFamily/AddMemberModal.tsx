import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useHouseholdStore } from '../../stores/householdStore';
import { Gender, RelationKind, RELATION_SUGGESTIONS, RELATION_LABELS } from '../../types/household';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  nativeName: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'unspecified']),
  relationKind: z.string().min(1, 'Relationship is required'),
  dateOfBirth: z.string().optional(),
  phonetic: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const { addPerson, addRelationship, getHead } = useHouseholdStore();
  const head = getHead();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: 'unspecified',
      relationKind: ''
    },
    mode: 'onChange'
  });

  const selectedGender = watch('gender') as Gender;

  const onSubmit = (data: FormData) => {
    if (!head) return;

    // Add the person
    const personId = addPerson({
      name: data.name,
      gender: data.gender,
      notes: data.notes,
    });

    // Add relationship to head
    addRelationship({
      fromPersonId: personId,
      toPersonId: head.id,
      kind: data.relationKind as RelationKind
    });

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !head) return null;

  const availableRelations = RELATION_SUGGESTIONS[selectedGender] || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="glass-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium gradient-text">
                Add Family Member
              </h3>
              <button
                onClick={handleClose}
                className="text-orange-400 hover:text-orange-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-orange-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 ${
                    errors.name ? 'border-red-300' : 'border-orange-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'unspecified', label: 'Not specified' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center p-2 border border-orange-300 rounded cursor-pointer hover:border-orange-400 transition-colors text-sm bg-white/60 hover:bg-white/80">
                      <input
                        type="radio"
                        {...register('gender')}
                        value={option.value}
                        className="mr-2 text-orange-600"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label htmlFor="relationKind" className="block text-sm font-medium text-orange-800 mb-1">
                  Relationship to {head.name} <span className="text-red-500">*</span>
                </label>
                <select
                  id="relationKind"
                  {...register('relationKind')}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 ${
                    errors.relationKind ? 'border-red-300' : 'border-orange-300'
                  }`}
                >
                  <option value="">Select relationship</option>
                  {availableRelations.map(relation => (
                    <option key={relation} value={relation}>
                      {RELATION_LABELS[relation]}
                    </option>
                  ))}
                </select>
                {errors.relationKind && (
                  <p className="mt-1 text-xs text-red-600">{errors.relationKind.message}</p>
                )}
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-base font-medium text-white hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 sacred-glow"
            >
              Add Member
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-orange-300 shadow-sm px-4 py-2 bg-white/80 text-base font-medium text-orange-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};