export function validateStep(stepIndex, data) {
  const newErrors = {};
  const required = {
    0: ['ramp', 'growth', 'churn', 'baseline'],
    1: ['targetSpend', 'targetRevenue', 'pctAcq'],
    2: ['months', 'startYear'],
  };
  (required[stepIndex] || []).forEach((field) => {
    if (data[field] === undefined || data[field] === null || data[field] === '' && data[field] !== 0) {
      newErrors[field] = 'This field is required';
    }
  });
  return newErrors;
}
