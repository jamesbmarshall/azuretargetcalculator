export const currencySymbols = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥',
  AUD: '$', CAD: '$', CHF: 'CHF ', CNY: '¥', INR: '₹',
};

export function formatCurrency(num, code = 'USD') {
  const symbol = currencySymbols[code] || '$';
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(num));
  return num < 0 ? `(${symbol}${formatted})` : `${symbol}${formatted}`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
}