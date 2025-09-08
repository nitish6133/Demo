import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  key: string;
  label: string;
  description: string;
}

interface StepIndicatorProps {
  steps: readonly Step[];
  currentStep: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-orange-500 border-orange-500 text-white sacred-glow' 
                    : isCurrent 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-500 text-white pulse-glow' 
                      : 'bg-white/80 border-orange-300 text-orange-600'
                  }
                `}>
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${
                    isCompleted || isCurrent ? 'text-orange-900' : 'text-orange-600'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-orange-500 max-w-20">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  isCompleted ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-orange-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};