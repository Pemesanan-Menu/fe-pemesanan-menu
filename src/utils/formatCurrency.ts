/**
 * Format number to Indonesian Rupiah currency
 * @param amount - Amount in number
 * @returns Formatted currency string (e.g., "Rp 25.000")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
