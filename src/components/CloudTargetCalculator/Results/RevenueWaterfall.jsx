// src/components/CloudTargetCalculator/Results/RevenueWaterfall.jsx
// ------------------------------------------------------------------
// Waterfall chart (Recharts v2)
//
// • Uses "start" (invisible) + "delta" (visible) stacked bars
//   to achieve the step-up effect.
// • Colours come from an explicit `color` property on each row
//   and are applied via <Cell> so no black fallback ever appears.
// • Y-axis ticks are shortened ($40k) for readability.
// ------------------------------------------------------------------

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

export default function RevenueWaterfall({ data, currency }) {
  if (!data) return null;

  /* ---------- 1. Define stages  ---------- */
  const stageDefs = [
    { name: 'Baseline',    delta: data.baselineTotal,      color: '#9ca3af' },
    { name: 'Acquisition', delta: data.newCustomerRevenue, color: '#34d399' },
    { name: 'Proactive',   delta: data.proactiveRevenue,   color: '#34d399' },
    { name: 'Total',       delta: data.totalRevenue,       color: '#3b82f6', isTotal: true },
  ];

  /* ---------- 2. Build rows with start & cumulative ---------- */
  let cumulative = 0;
  const rows = stageDefs.map((s) => {
    const start = s.isTotal ? 0 : cumulative;
    if (!s.isTotal) cumulative += s.delta;
    return { ...s, start, cumulative: s.isTotal ? s.delta : start + s.delta };
  });

  const yMax = Math.max(...rows.map((r) => r.cumulative)) * 1.15 || 1;

  /* ---------- 3. Helpers ---------- */
  const abbreviate = (n) => (n >= 1_000 ? `${(n / 1_000).toFixed(0)}k` : n);
  const tickFmt    = (v) => `$${abbreviate(v)}`;

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-medium">{formatCurrency(data.delta, currency)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Cumulative: <span className="font-medium">{formatCurrency(data.cumulative, currency)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  /* ---------- 4. Render ---------- */
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Revenue Waterfall Chart</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={rows}
          margin={{ top: 20, right: 20, left: 0, bottom: 36 }}
          barCategoryGap={32}
        >
          {/* Invisible offset */}
          <Bar dataKey="start" stackId="wf" fill="transparent" isAnimationActive={false} />

          {/* Visible delta */}
          <Bar dataKey="delta" stackId="wf" isAnimationActive={false} radius={[4, 4, 0, 0]}>
            {rows.map((row, index) => (
              <Cell key={index} fill={row.color} />
            ))}
            <LabelList
              dataKey="cumulative"
              position="top"
              formatter={(v) => formatCurrency(v, currency)}
              style={{ fill: '#111827', fontSize: 12, fontWeight: 600 }}
            />
          </Bar>

          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, yMax]}
            tickFormatter={tickFmt}
          />
          <Tooltip content={customTooltip} cursor={{ fill: '#f3f4f6' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}