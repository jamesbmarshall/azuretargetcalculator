import React from 'react';
import { TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import FormField from './FormField';
import Input from './Input';

export default function CurrentBusinessStep({ data, update, errors, nextStep }) {
  return (
    <div className="px-8 md:px-12 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Current Business Metrics</h2>
          <p className="text-gray-600 text-lg">Tell us about your current business performance</p>
        </div>

        {/* Form Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <div className="grid md:grid-cols-2 gap-10">
            <FormField
              label="Ramp-up Period (Months)"
              description="How many months does it take for a new customer to reach target spend?"
              icon={<TrendingUp className="w-4 h-4" />}
              error={errors.ramp}
              required
            >
              <Input
                type="number"
                value={data.ramp}
                onChange={(e) => update('ramp', Number(e.target.value))}
                error={errors.ramp}
                min="1"
                placeholder="e.g., 6"
                aria-describedby={errors.ramp ? 'ramp-error' : undefined}
              />
            </FormField>

            <FormField
              label="Organic Growth Rate (% per month)"
              description="Monthly growth rate without proactive engagement"
              icon={<TrendingUp className="w-4 h-4" />}
              error={errors.growth}
              required
            >
              <div className="relative">
                <Input
                  type="number"
                  value={data.growth}
                  onChange={(e) => update('growth', Number(e.target.value))}
                  error={errors.growth}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  className="pr-12"
                  aria-describedby={errors.growth ? 'growth-error' : undefined}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
              </div>
            </FormField>

            <FormField
              label="Revenue Churn Rate (% per month)"
              description="Monthly revenue loss from customer churn"
              icon={<TrendingUp className="w-4 h-4 rotate-180 text-red-500" />}
              error={errors.churn}
              required
            >
              <div className="relative">
                <Input
                  type="number"
                  value={data.churn}
                  onChange={(e) => update('churn', Number(e.target.value))}
                  error={errors.churn}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  className="pr-12"
                  aria-describedby={errors.churn ? 'churn-error' : undefined}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
              </div>
            </FormField>

            <FormField
              label="Baseline Monthly Revenue"
              description="Current monthly recurring revenue before plan execution"
              icon={<DollarSign className="w-4 h-4" />}
              error={errors.baseline}
              required
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <Input
                  type="number"
                  value={data.baseline}
                  onChange={(e) => update('baseline', Number(e.target.value))}
                  error={errors.baseline}
                  min="0"
                  step="1000"
                  placeholder="e.g., 50000"
                  className="pl-12"
                  aria-describedby={errors.baseline ? 'baseline-error' : undefined}
                />
              </div>
            </FormField>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end mt-12">
          <button
            onClick={nextStep}
            className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-3 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            <span>Continue to Targets</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}