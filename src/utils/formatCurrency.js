// src/utils/formatCurrency.js
// Formats a number as Philippine Pesos (adjust locale/currency as needed)

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style:    'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}
