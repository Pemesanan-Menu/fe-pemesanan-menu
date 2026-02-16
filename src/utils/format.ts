export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const parseFormattedNumber = (value: string): number => {
  return parseInt(value.replace(/\./g, '')) || 0
}

export const formatInputNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
