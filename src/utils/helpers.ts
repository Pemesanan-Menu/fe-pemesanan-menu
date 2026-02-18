/**
 * Utility functions for data transformation and mapping
 */

import type { OrderStatus } from '@/types'

/**
 * Map order status to display text
 */
export const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    MENUNGGU: 'Menunggu',
    DIPROSES: 'Diproses',
    SELESAI: 'Selesai',
    DIBAYAR: 'Dibayar',
    DIBATALKAN: 'Dibatalkan',
  }
  return statusMap[status] || status
}

/**
 * Map order status to color variant
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    MENUNGGU: 'yellow',
    DIPROSES: 'blue',
    SELESAI: 'green',
    DIBAYAR: 'purple',
    DIBATALKAN: 'red',
  }
  return colorMap[status] || 'gray'
}

/**
 * Format currency to IDR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date to Indonesian locale
 */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

/**
 * Calculate remaining time in minutes
 */
export const calculateRemainingTime = (
  createdAt: string,
  estimatedMinutes?: number
): number => {
  if (!estimatedMinutes) return 0
  
  const created = new Date(createdAt).getTime()
  const now = Date.now()
  const elapsed = Math.floor((now - created) / 1000 / 60)
  const remaining = estimatedMinutes - elapsed
  
  return Math.max(0, remaining)
}
