// src/components/CloudTargetCalculator/Results/SummaryCards.jsx
import React from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  Target as Bullseye,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

/** One reusable pill-card ********************************************** */
function MetricCard({ title, value, bg, text, icon }) {
  return (
    <div className={`p-6 rounded-2xl ${bg}`}>
      <div className="flex items-center mb-1 space-x-2">
        {icon}
        <span className={`text-sm font-semibold ${text}`}>{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

/** Summary section shown before the full breakdown table *************** */
export default function SummaryCards({ results, currency }) {
  const {
    totalRevenue,
    baselineTotal,
    newCustomerRevenue,
    proactiveRevenue,
    marketing: { mqls },
    totalCustomers,
  } = results;

  return (
    <div className="space-y-6">
      {/* --- Metric cards (two-column grid on desktop) ------------------ */}
      <div className="grid md:grid-cols-2 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue, currency)}
          bg="bg-blue-50"
          text="text-blue-700"
          icon={<DollarSign className="w-4 h-4 text-blue-600" />}
        />
        <MetricCard
          title="New Customers"
          value={formatNumber(totalCustomers)}
          bg="bg-green-50"
          text="text-green-700"
          icon={<Users className="w-4 h-4 text-green-600" />}
        />
        <MetricCard
          title="Baseline Revenue"
          value={formatCurrency(baselineTotal, currency)}
          bg="bg-purple-50"
          text="text-purple-700"
          icon={<TrendingUp className="w-4 h-4 text-purple-600" />}
        />
        <MetricCard
          title="MQLs Needed"
          value={formatNumber(mqls)}
          bg="bg-orange-50"
          text="text-orange-700"
          icon={<Bullseye className="w-4 h-4 text-orange-600" />}
        />
      </div>

      {/* --- Revenue breakdown panel ----------------------------------- */}
      <div className="bg-white shadow rounded-2xl border border-gray-100">
        <div className="p-4 border-b bg-gray-50 rounded-t-2xl">
          <h3 className="font-semibold">Revenue Breakdown</h3>
        </div>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-3 px-6">Existing Business Revenue</td>
              <td className="py-3 px-6 text-right font-mono">
                {formatCurrency(baselineTotal, currency)}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 px-6">New Customer Revenue</td>
              <td className="py-3 px-6 text-right font-mono">
                {formatCurrency(newCustomerRevenue, currency)}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-6">Proactive Growth Revenue</td>
              <td className="py-3 px-6 text-right font-mono">
                {formatCurrency(proactiveRevenue, currency)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="pt-2">
                <hr />
              </td>
            </tr>
            <tr>
              <td className="py-3 px-6 font-semibold">Total Revenue Target</td>
              <td className="py-3 px-6 text-right font-semibold font-mono text-blue-700">
                {formatCurrency(totalRevenue, currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}