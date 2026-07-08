/**
 * Formats an integer paise amount into an Indian-locale rupee string.
 * e.g. 118000 -> "₹1,180", 12345600 -> "₹1,23,456", 118050 -> "₹1,180.50"
 */
export function formatPricePaise(amountPaise: number): string {
  const rupees = amountPaise / 100;
  const hasFraction = Math.round(amountPaise) % 100 !== 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  }).format(rupees);
}
