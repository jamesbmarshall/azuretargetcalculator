import React from 'react';
import { Users, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import FormField from './FormField';
import Input from './Input';

export default function TargetsStep({ data, update, errors, prevStep, nextStep }) {
  return (
    <div className="px-8 md:px-12 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Revenue Targets</h2>
          <p className="text-gray-600 text-lg">Define your target metrics and goals</p>
        </div>

        {/* Form Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <div className="grid md:grid-cols-2 gap-10">
            <FormField
              label="Target Spend per Customer"
              description="Expected monthly spend per customer (mean/median/aspirational)"
              icon={<Users className="w-4 h-4" />}
              error={errors.targetSpend}
              required
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <Input
                  type="number"
                  value={data.targetSpend}
                  onChange={(e) => update('targetSpend', Number(e.target.value))}
                  error={errors.targetSpend}
                  min="1"
                  step="100"
                  placeholder="e.g., 1500"
                  className="pl-12"
                />
              </div>
            </FormField>

            <FormField
              label="Total Revenue Target"
              description="Total revenue needed within your plan duration"
              icon={<Target className="w-4 h-4" />}
              error={errors.targetRevenue}
              required
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <Input
                  type="number"
                  value={data.targetRevenue}
                  onChange={(e) => update('targetRevenue', Number(e.target.value))}
                  error={errors.targetRevenue}
                  min="1"
                  step="10000"
                  placeholder="e.g., 500000"
                  className="pl-12"
                />
              </div>
            </FormField>

            <FormField
              label="% Revenue from New Customers"
              description="Acquisition vs. expansion revenue split percentage"
              icon={<Users className="w-4 h-4" />}
              error={errors.pctAcq}
              required
              className="md:col-span-1"
            >
              <div className="relative">
                <Input
                  type="number"
                  value={data.pctAcq}
                  onChange={(e) => update('pctAcq', Number(e.target.value))}
                  error={errors.pctAcq}
                  min="0"
                  max="100"
                  step="5"
                  placeholder="e.g., 60"
                  className="pr-12"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
              </div>
            </FormField>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <button
            onClick={prevStep}
            className="group px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3 focus:outline-none focus:ring-4 focus:ring-gray-300/50"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Current</span>
          </button>
          <button
            onClick={nextStep}
            className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-3 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            <span>Continue to Settings</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}