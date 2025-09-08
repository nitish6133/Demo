import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useHouseholdStore } from '../../stores/householdStore';
import { ChevronRight, Home } from 'lucide-react';

const schema = z.object({
  gotram: z.string().min(1, 'Gotram is required'),
  familyDisplayName: z.string().optional(),
  gotramPhonetic: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const HouseholdBasicsSection: React.FC = () => {
  const { gotram, familyDisplayName, gotramPhonetic, updateBasics, setCurrentStep } = useHouseholdStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gotram,
      familyDisplayName,
      gotramPhonetic
    },
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {
    updateBasics(data);
    setCurrentStep('head');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-4 sacred-glow float-animation">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Household Basics
        </h2>
        <p className="text-orange-700">
          Let's start with your family's foundational details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Gotram */}
        <div>
          <label htmlFor="gotram" className="block text-sm font-medium text-orange-800 mb-2">
            Gotram <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="gotram"
            {...register('gotram')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 ${
              errors.gotram ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-orange-300'
            }`}
            placeholder="e.g., Kashyapa, Bharadwaja"
          />
          {errors.gotram && (
            <p className="mt-1 text-sm text-red-600">{errors.gotram.message}</p>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isValid}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 sacred-glow"
          >
            Continue to Head of Family
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};