import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function ProactiveBreakdown({ data, currency }) {
  if (!data || !data.length) return null;
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Proactive Growth Target Breakdown</h3>
      <p className="text-sm text-gray-600 mb-4">This table breaks down the proactive growth target across months.</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-700 border-b">Month</th>
              <th className="text-right p-4 font-semibold text-gray-700 border-b">Monthly Proactive Growth Target</th>
              <th className="text-right p-4 font-semibold text-gray-700 border-b">Cumulative Proactive Growth Target</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b font-medium">{row.month}</td>
                <td className="p-4 border-b text-right font-mono">{formatCurrency(row.monthly, currency)}</td>
                <td className="p-4 border-b text-right font-mono">{formatCurrency(row.cumulative, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}