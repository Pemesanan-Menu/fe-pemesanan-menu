/**
 * Application constants
 */

import type { OrderStatus, UserRole } from '@/types'

/**
 * Order status constants
 */
export const ORDER_STATUS: Record<string, OrderStatus> = {
  MENUNGGU: 'MENUNGGU',
  DIPROSES: 'DIPROSES',
  SIAP: 'SIAP',
  SELESAI: 'SELESAI',
  DIBATALKAN: 'DIBATALKAN',
} as const

/**
 * User role constants
 */
export const USER_ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  CASHIER: 'cashier',
  PRODUCTION: 'production',
} as const

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Menu (Public)
  MENU: '/menu',
  CATEGORIES: '/categories',
  
  // Orders
  ORDERS: '/orders',
  ORDER_TRACKING: (id: string) => `/orders/${id}/tracking`,
  ORDER_RECEIPT: (id: string) => `/orders/${id}/receipt`,
  ORDER_PAY: (id: string) => `/orders/${id}/pay`,
  ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,
  
  // Production
  PRODUCTION_QUEUE: '/production/queue',
  PRODUCTION_UPDATE: (id: string) => `/production/orders/${id}`,
  PRODUCTION_LOGS: (id: string) => `/production/orders/${id}/logs`,
  
  // Tables
  TABLES: '/tables',
  TABLE_VALIDATE: '/tables/validate',
  TABLE_QRCODE: (id: string) => `/tables/${id}/qrcode`,
  
  // Products (Admin)
  PRODUCTS: '/products',
  PRODUCT_IMAGE: (id: string) => `/products/${id}/image`,
  
  // Users (Admin)
  USERS: '/users',
  
  // Dashboard (Admin)
  DASHBOARD: '/dashboard',
  
  // Export (Admin)
  EXPORT_ORDERS: '/export/orders',
  
  // SSE
  SSE_TRACKING: (id: string) => `/sse/orders/${id}`,
  SSE_CASHIER: '/sse/cashier',
  SSE_PRODUCTION: '/sse/production',
} as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  CART: 'cart',
  TABLE_NUMBER: 'tableNumber',
} as const

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  MENU: 'menu',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  ORDER: 'order',
  TRACKING: 'tracking',
  PRODUCTION_QUEUE: 'production-queue',
  PRODUCTION_LOGS: 'production-logs',
  TABLES: 'tables',
  TABLE: 'table',
  PRODUCTS: 'products',
  PRODUCT: 'product',
  USERS: 'users',
  USER: 'user',
  DASHBOARD: 'dashboard',
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const
