import React from 'react';
import { Calendar, Globe, TrendingUp, ChevronLeft, Calculator } from 'lucide-react';
import { monthNames } from '../utils/monthNames';
import FormField from './FormField';
import Input from './Input';
import Select from './Select';

export default function SettingsStep({ data, update, errors, prevStep, onCalculate, isCalculating }) {
  return (
    <div className="px-8 md:px-12 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Plan Settings</h2>
          <p className="text-gray-600 text-lg">Configure your plan duration and optional settings</p>
        </div>

        <div className="space-y-12">
          {/* Calendar Settings */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-10 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
              <Calendar className="w-6 h-6 mr-4 text-blue-600" />
              Calendar Settings
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                label="Plan Duration (Months)"
                description="How many months will your plan cover?"
                error={errors.months}
                required
              >
                <Input
                  type="number"
                  value={data.months}
                  onChange={(e) => update('months', Number(e.target.value))}
                  error={errors.months}
                  min="1"
                  placeholder="e.g., 12"
                />
              </FormField>

              <FormField
                label="Start Month"
                description="When will you begin plan execution?"
              >
                <Select
                  value={data.startMonth}
                  onChange={(e) => update('startMonth', Number(e.target.value))}
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Start Year"
                error={errors.startYear}
                required
              >
                <Input
                  type="number"
                  value={data.startYear}
                  onChange={(e) => update('startYear', Number(e.target.value))}
                  error={errors.startYear}
                  min="2000"
                  placeholder="e.g., 2025"
                />
              </FormField>

              <FormField
                label="Currency"
                icon={<Globe className="w-4 h-4" />}
              >
                <Select
                  value={data.currency}
                  onChange={(e) => update('currency', e.target.value)}
                >
                  <option value="USD">USD - United States Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="INR">INR - Indian Rupee</option>
                </Select>
              </FormField>

              <div className="md:col-span-2 mt-6">
                <label className="flex items-start space-x-4 cursor-pointer group p-6 rounded-lg hover:bg-white/50 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={data.seasonalToggle}
                    onChange={(e) => update('seasonalToggle', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      Apply Seasonality Adjustments
                    </span>
                    <p className="text-sm text-gray-600 mt-2">
                      Adjust calculations based on calendar month variations
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Marketing Settings */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-10 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
              <TrendingUp className="w-6 h-6 mr-4 text-emerald-600" />
              Marketing Conversion Settings
              <span className="ml-4 text-sm text-gray-500 font-normal">(Optional)</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                label="MQLs per SQL"
                description="Marketing qualified leads needed per sales qualified lead"
              >
                <Input
                  type="number"
                  value={data.mqlPerSql}
                  onChange={(e) => update('mqlPerSql', Number(e.target.value))}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 3.5"
                />
              </FormField>

              <FormField
                label="SQLs per Win"
                description="Sales qualified leads needed per won customer"
              >
                <Input
                  type="number"
                  value={data.sqlPerWin}
                  onChange={(e) => update('sqlPerWin', Number(e.target.value))}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 4.2"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <button
            onClick={prevStep}
            className="group px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3 focus:outline-none focus:ring-4 focus:ring-gray-300/50"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Targets</span>
          </button>
          <button
            onClick={onCalculate}
            disabled={isCalculating}
            className="group px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
          >
            {isCalculating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                <span>Calculate Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}