import React from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function MarketingFunnel({ data, currency }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center space-x-3">
          <span>Marketing Funnel Requirements</span>
        </h2>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">{formatNumber(data.mqls)}</div>
            <div className="text-sm font-semibold text-blue-700">Marketing Qualified Leads</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-emerald-900 mb-2">{formatNumber(data.sqls)}</div>
            <div className="text-sm font-semibold text-emerald-700">Sales Qualified Leads</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-purple-900 mb-2">{formatNumber(data.wins)}</div>
            <div className="text-sm font-semibold text-purple-700">Won Customers</div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-2">Pro Tip</h4>
              <p className="text-amber-800">
                Based on an average lead acquisition cost of {formatCurrency(300, currency)}, you should consider
                allocating at least {formatCurrency(300 * data.mqls, currency)} to your marketing budget. Remember that
                cloud sales cycles typically last 3‑9 months, so plan your activities accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}