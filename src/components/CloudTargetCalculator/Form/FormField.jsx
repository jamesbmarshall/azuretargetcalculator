import React from 'react';

export default function FormField({ 
  label, 
  description, 
  icon, 
  error, 
  children, 
  required = false,
  className = "" 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block">
        <div className="flex items-center space-x-3 mb-3">
          {icon && <div className="text-blue-600">{icon}</div>}
          <span className="text-sm font-semibold text-gray-800">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
        )}
      </label>
      {children}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          <span className="text-red-500">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}