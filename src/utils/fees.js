/**
 * Single source of truth for order fees.
 * Previously hardcoded in src/components/cart/CartDrawer.jsx and
 * src/pages/customer/CheckoutPage.jsx. Update here only.
 */

export const DELIVERY_FEE = 80; // PHP

/**
 * Format a fee as PHP currency.
 * @param {number} amount
 * @returns {string} e.g. "₱80.00"
 */
export function formatFee(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
