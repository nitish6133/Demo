import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useHouseholdStore } from '../../stores/householdStore';
import { ChevronRight, ChevronLeft, Crown } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  nativeName: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'unspecified']),
  dateOfBirth: z.string().optional(),
  phonetic: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const HeadOfFamilyCard: React.FC = () => {
  const { people, addPerson, updatePerson, setCurrentStep, getHead } = useHouseholdStore();
  const head = getHead();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: head ? {
      name: head.name,
      gender: head.gender,
      notes: head.notes,
    } : {
      gender: 'unspecified'
    },
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {
    if (head) {
      updatePerson(head.id, { ...data, isHead: true });
    } else {
      addPerson({ ...data, isHead: true });
    }
    setCurrentStep('members');
  };

  const goBack = () => {
    setCurrentStep('basics');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 sacred-glow float-animation">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Head of Family
        </h2>
        <p className="text-orange-700">
          Add the primary person who will be the reference point for all relationships
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-orange-800 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 ${
              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-orange-300'
            }`}
            placeholder="Enter full name in Latin script"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-orange-800 mb-3">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
              { value: 'unspecified', label: 'Prefer not to say' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border border-orange-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors bg-white/60 hover:bg-white/80">
                <input
                  type="radio"
                  {...register('gender')}
                  value={option.value}
                  className="mr-3 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-orange-800">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
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
            type="submit"
            disabled={!isValid}
            className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 sacred-glow"
          >
            Continue to Members
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};