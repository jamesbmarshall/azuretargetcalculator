import React from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function BreakdownTable({ rows, showDetails, currency }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-4 font-semibold text-gray-700 border-b">Month</th>
            <th className="text-right p-4 font-semibold text-gray-700 border-b">New Customers</th>
            <th className="text-right p-4 font-semibold text-gray-700 border-b">Total Customers</th>
            {showDetails && (
              <>
                <th className="text-right p-4 font-semibold text-gray-700 border-b">New Customer Revenue</th>
                <th className="text-right p-4 font-semibold text-gray-700 border-b">Baseline Revenue</th>
              </>
            )}
            <th className="text-right p-4 font-semibold text-gray-700 border-b">Monthly Total</th>
            <th className="text-right p-4 font-semibold text-gray-700 border-b">Cumulative Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 border-b font-medium">{m.month}</td>
              <td className="p-4 border-b text-right font-mono">{formatNumber(m.newCustomers)}</td>
              <td className="p-4 border-b text-right font-mono">{formatNumber(m.runningTotalCustomers)}</td>
              {showDetails && (
                <>
                  <td className="p-4 border-b text-right font-mono">{formatCurrency(m.newCustRevenue, currency)}</td>
                  <td className="p-4 border-b text-right font-mono">{formatCurrency(m.baselineRevenue, currency)}</td>
                </>
              )}
              <td className="p-4 border-b text-right font-mono font-semibold">{formatCurrency(m.totalRevenue, currency)}</td>
              <td className="p-4 border-b text-right font-mono font-semibold">{formatCurrency(m.cumulativeRevenue, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}