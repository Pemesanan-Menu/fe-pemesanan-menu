export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}

export const formatInputNumber = (value: string): string => {
  // Remove non-numeric characters except dots
  const cleaned = value.replace(/[^\d]/g, '')
  // Format with thousand separators
  return new Intl.NumberFormat('id-ID').format(Number(cleaned))
}

export const parseFormattedNumber = (value: string): number => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/[^\d]/g, '')
  return Number(cleaned) || 0
}
