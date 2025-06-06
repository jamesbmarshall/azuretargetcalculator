// src/components/CloudTargetCalculator/StepNavigation.jsx
import React from 'react';
import { BarChart3, Target, Settings, Check } from 'lucide-react';
import StepProgressBar from './StepProgressBar';

const steps = [
  { id: 0, title: 'Current', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 1, title: 'Targets', icon: <Target className="w-4 h-4" /> },
  { id: 2, title: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export default function StepNavigation({ currentStep, setStep }) {
  return (
    <div className="bg-white border-b border-gray-100 px-8 md:px-12 py-8">
      {/* Step Navigation */}
      <nav className="flex justify-between md:justify-start md:space-x-16 mb-10" aria-label="Form steps">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isComplete = idx < currentStep;
          const isUpcoming = idx > currentStep;

          return (
            <button
              key={step.id}
              onClick={() => setStep(idx)}
              type="button"
              className={`
                flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2 transition-all duration-300
                ${isActive ? 'text-blue-700' : isComplete ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-400 hover:text-gray-600'}
              `}
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300 mb-3 relative overflow-hidden
                  ${isActive
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-110'
                    : isComplete
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'}
                `}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                    {step.icon}
                  </div>
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 rounded-2xl" />
                )}
              </div>
              <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? 'text-blue-700' : ''}`}>
                {step.title}
              </span>
              {isUpcoming && (
                <span className="text-xs text-gray-400 mt-1">Upcoming</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Progress Bar */}
      <StepProgressBar current={currentStep} total={steps.length} />
    </div>
  );
}