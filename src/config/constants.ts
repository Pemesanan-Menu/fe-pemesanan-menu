export const APP_CONFIG = {
  name: 'Caffe Tetangga',
  shortName: 'CT',
  description: 'Sistem Pemesanan Menu & Monitoring Produksi',
  version: '1.0.0',
  copyright: '© 2026 UMKM Ordering System',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  MENU: {
    LIST: '/menu',
    DETAIL: (id: string) => `/menu/${id}`,
    CREATE: '/menu',
    UPDATE: (id: string) => `/menu/${id}`,
    DELETE: (id: string) => `/menu/${id}`,
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
  },
  TABLES: {
    LIST: '/tables',
    DETAIL: (id: string) => `/tables/${id}`,
  },
} as const

export const ROLES = {
  ADMIN: 'ADMIN',
  KASIR: 'KASIR',
  PRODUKSI: 'PRODUKSI',
  PELAYAN: 'PELAYAN',
} as const
