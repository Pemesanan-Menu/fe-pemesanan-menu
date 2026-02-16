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

// UI Constants for responsive design
export const UI = {
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
  SPACING: {
    MOBILE: {
      PADDING: 'p-4',
      PADDING_X: 'px-4',
      PADDING_Y: 'py-4',
      GAP: 'gap-2',
    },
    DESKTOP: {
      PADDING: 'lg:p-6',
      PADDING_X: 'lg:px-6',
      PADDING_Y: 'lg:py-6',
      GAP: 'lg:gap-4',
    },
    RESPONSIVE: {
      PADDING: 'p-4 lg:p-6',
      PADDING_X: 'px-4 lg:px-6',
      PADDING_Y: 'py-4 lg:py-6',
      GAP: 'gap-2 lg:gap-4',
    },
  },
  SIDEBAR: {
    WIDTH: 'w-64',
    MARGIN: 'lg:ml-64',
  },
  TEXT: {
    HEADING: 'text-2xl lg:text-3xl',
    SUBHEADING: 'text-lg lg:text-xl',
    BODY: 'text-sm lg:text-base',
  },
  COLORS: {
    PRIMARY: {
      DEFAULT: 'bg-purple-600 hover:bg-purple-700',
      TEXT: 'text-purple-600 dark:text-purple-400',
      BORDER: 'border-purple-600',
      GRADIENT: 'bg-gradient-to-r from-purple-600 to-fuchsia-600',
    },
    SECONDARY: {
      DEFAULT: 'bg-gray-600 hover:bg-gray-700',
      TEXT: 'text-gray-600 dark:text-gray-400',
    },
    SUCCESS: {
      DEFAULT: 'bg-green-600 hover:bg-green-700',
      TEXT: 'text-green-600 dark:text-green-400',
      LIGHT: 'bg-green-50 dark:bg-green-900/20',
    },
    DANGER: {
      DEFAULT: 'bg-red-600 hover:bg-red-700',
      TEXT: 'text-red-600 dark:text-red-400',
      LIGHT: 'bg-red-50 dark:bg-red-900/20',
      BORDER: 'border-red-300 dark:border-gray-700',
    },
    WARNING: {
      DEFAULT: 'bg-yellow-600 hover:bg-yellow-700',
      TEXT: 'text-yellow-600 dark:text-yellow-400',
      LIGHT: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    INFO: {
      DEFAULT: 'bg-blue-600 hover:bg-blue-700',
      TEXT: 'text-blue-600 dark:text-blue-400',
      LIGHT: 'bg-blue-50 dark:bg-blue-900/20',
    },
  },
  BACKGROUND: {
    PRIMARY: 'bg-white dark:bg-gray-800',
    SECONDARY: 'bg-gray-50 dark:bg-gray-900',
    HOVER: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    ACTIVE: 'bg-purple-50 dark:bg-purple-900/20',
  },
  BORDER: {
    DEFAULT: 'border border-gray-200 dark:border-gray-700',
    LIGHT: 'border border-gray-300 dark:border-gray-600',
    FOCUS: 'focus:ring-2 focus:ring-purple-500 focus:border-transparent',
  },
  TEXT_COLOR: {
    PRIMARY: 'text-gray-900 dark:text-white',
    SECONDARY: 'text-gray-600 dark:text-gray-400',
    MUTED: 'text-gray-500 dark:text-gray-500',
  },
  SHADOW: {
    SM: 'shadow-sm',
    DEFAULT: 'shadow',
    MD: 'shadow-md',
    LG: 'shadow-lg',
    XL: 'shadow-xl',
    '2XL': 'shadow-2xl',
  },
  ROUNDED: {
    SM: 'rounded',
    DEFAULT: 'rounded-lg',
    MD: 'rounded-lg',
    LG: 'rounded-xl',
    FULL: 'rounded-full',
  },
  TRANSITION: {
    DEFAULT: 'transition-colors duration-200',
    ALL: 'transition-all duration-200',
    FAST: 'transition-colors duration-150',
  },
  FONT: {
    WEIGHT: {
      NORMAL: 'font-normal',
      MEDIUM: 'font-medium',
      SEMIBOLD: 'font-semibold',
      BOLD: 'font-bold',
    },
    SIZE: {
      XS: 'text-xs',
      SM: 'text-sm',
      BASE: 'text-base',
      LG: 'text-lg',
      XL: 'text-xl',
      '2XL': 'text-2xl',
      '3XL': 'text-3xl',
    },
  },
} as const
