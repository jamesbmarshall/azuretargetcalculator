import React from 'react';
import { Calculator } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center space-y-6">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <div className="py-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{lineHeight: '1.2', paddingBottom: '0.25rem', overflow: 'visible'}}>
            Cloud Target Calculator
          </h1>
        </div>
      </div>
      <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
        Transform complex revenue planning into clear, actionable insights. Forecast customer acquisition,
        track growth trends, and optimize your path to hitting ambitious targets with confidence.
      </p>
    </header>
  );
}