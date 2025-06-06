import React from 'react';

export default function Select({ error, children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`
        w-full px-4 py-3.5 border-2 rounded-lg transition-all duration-200 
        focus:ring-4 focus:ring-blue-500/20 focus:outline-none
        hover:border-gray-300 bg-white cursor-pointer
        ${error 
          ? 'border-red-300 focus:border-red-500 bg-red-50/50' 
          : 'border-gray-200 focus:border-blue-500'
        }
        ${className}
      `}
    >
      {children}
    </select>
  );
}