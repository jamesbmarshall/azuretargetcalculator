import React from 'react';

/**
 * Renders a horizontal progress bar whose width is calculated from the
 * current step (zero-based) and the total number of steps.
 */
export default function StepProgressBar({ current, total }) {
  const pct = (current / (total - 1)) * 100;
  
  return (
    <div className="w-full">
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          style={{ width: `${pct}%` }}
          className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 transition-all duration-700 ease-out shadow-sm"
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Start</span>
        <span className={`transition-colors duration-300 ${current === total - 1 ? 'text-purple-600 font-medium' : ''}`}>
          Complete
        </span>
      </div>
    </div>
  );
}