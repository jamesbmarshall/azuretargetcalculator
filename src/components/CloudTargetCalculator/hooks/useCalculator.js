// src/components/CloudTargetCalculator/hooks/useCalculator.js
// -----------------------------------------------------------------------------
// Pure-math hook – derives every figure the UI needs from the current form
// state.  Memoised with useCallback so the computation only re-runs when
// inputs change.
// -----------------------------------------------------------------------------

import { useCallback } from 'react';
import { monthNames } from '../utils/monthNames';

export default function useCalculator(formData) {
  return useCallback(() => {
    /* ─────────────────────────── 1. Destructure & helpers ────────────────── */
    const {
      ramp,
      growth,
      churn,
      baseline,
      targetSpend,
      targetRevenue,
      pctAcq,
      months,
      startMonth,
      startYear,
      seasonalToggle,
      mqlPerSql,
      sqlPerWin,
    } = formData;

    const g = growth / 100;   // organic growth (decimal)
    const c = churn / 100;    // churn (decimal)
    const P = pctAcq / 100;   // % of delta revenue that must come from new customers

    /* ─────────────────────────── 2. Seasonality factors ──────────────────── */
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (
      (startYear % 4 === 0 && startYear % 100 !== 0) ||
      startYear % 400 === 0
    ) {
      daysInMonth[1] = 29; // leap-year February
    }

    const baselineDays = 30;         // normalising denominator
    let baselineTotal   = 0;
    const monthFactors  = [];

    for (let i = 0; i < months; i++) {
      const idx     = (startMonth + i) % 12;
      const factor  = seasonalToggle ? daysInMonth[idx] / baselineDays : 1;
      monthFactors.push(factor);

      const baseRev =
        baseline *
        Math.pow(1 + g, i) *
        Math.pow(1 - c, i) *
        factor;

      baselineTotal += baseRev;
    }

    /* ─────────────────────────── 3. Gap to fill & revenues ───────────────── */
    const addlTarget      = targetRevenue - baselineTotal;      // revenue shortfall
    const newRevTarget    = Math.max(0, addlTarget * P);        // via acquisition
    const proactiveTarget = Math.max(0, addlTarget * (1 - P));  // via expansion

    // Spend curve for a single customer of age N (months)
    const effectiveRevenue = (age) => {
      const ramped =
        age <= ramp
          ? targetSpend * (age / ramp)             // linear ramp-up
          : targetSpend * Math.pow(1 + g, age - ramp);
      return ramped * Math.pow(1 - c, age - 1);    // churn discount
    };

    /* ─────────────────────────── 4. Customers required ───────────────────── */
    let totalContr = 0;
    for (let m = 0; m < months; m++) {
      for (let age = 1; age <= months - m; age++) {
        totalContr += effectiveRevenue(age) * monthFactors[m];
      }
    }

    const baseNewCustomers =
      totalContr > 0 && newRevTarget > 0 ? newRevTarget / totalContr : 0;
    const monthlyCustomers = monthFactors.map((f) => baseNewCustomers * f);
    const totalCustomers   = monthlyCustomers.reduce((a, b) => a + b, 0);

    /* ─────────────────────────── 5. Monthly breakdown table ──────────────── */
    const monthlyData         = [];
    let cumulativeRevenue      = 0;
    let runningTotalCustomers  = 0;

    for (let m = 0; m < months; m++) {
      const newCustCount = monthlyCustomers[m];
      runningTotalCustomers += newCustCount;

      // revenue from this month’s cohort + earlier cohorts
      let newCustMonthRev = 0;
      for (let age = 1; age <= m + 1; age++) {
        newCustMonthRev += newCustCount * effectiveRevenue(age);
      }
      newCustMonthRev *= monthFactors[m];

      const baselineMonthRev =
        baseline *
        Math.pow(1 + g, m) *
        Math.pow(1 - c, m) *
        monthFactors[m];

      const monthTotal = newCustMonthRev + baselineMonthRev;
      cumulativeRevenue += monthTotal;

      const idx  = (startMonth + m) % 12;
      const yOff = Math.floor((startMonth + m) / 12);

      monthlyData.push({
        month: `${monthNames[idx]} ${startYear + yOff}`,
        newCustomers: newCustCount,
        runningTotalCustomers,
        newCustRevenue: newCustMonthRev,
        baselineRevenue: baselineMonthRev,
        totalRevenue: monthTotal,
        cumulativeRevenue,
      });
    }

    /* ─────────────────────────── 6. Proactive-growth split ───────────────── */
    const factorSum        = monthFactors.reduce((a, b) => a + b, 0);
    const proactiveMonthly = [];
    let cumulativePro      = 0;

    for (let m = 0; m < months; m++) {
      const monthPro = proactiveTarget * (monthFactors[m] / factorSum);
      cumulativePro += monthPro;

      proactiveMonthly.push({
        month: monthlyData[m].month,
        monthly: monthPro,
        cumulative: cumulativePro,
      });
    }

    /* ─────────────────────────── 7. Marketing funnel ─────────────────────── */
    const wins = totalCustomers;
    const sqls = wins * sqlPerWin;
    const mqls = sqls * mqlPerSql;

    /* ─────────────────────────── 8. Return payload ───────────────────────── */
    return {
      baselineTotal,
      newCustomerRevenue: newRevTarget,
      proactiveRevenue: proactiveTarget,
      totalRevenue: targetRevenue,
      totalCustomers,
      monthlyData,
      proactiveMonthly,
      marketing: { mqls, sqls, wins },
    };
  }, [formData]);
}