import type { User, MenuItem, Order, OrderItem } from '@/types'

// ============================================================================
// MOCK USERS
// ============================================================================

export const mockAdmin: User = {
  id: 'user-admin-1',
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
}

export const mockProduction: User = {
  id: 'user-prod-1',
  username: 'production',
  role: 'production',
  createdAt: '2024-01-01T00:00:00.000Z',
}

export const mockCashier: User = {
  id: 'user-cashier-1',
  username: 'cashier',
  role: 'cashier',
  createdAt: '2024-01-01T00:00:00.000Z',
}

// ============================================================================
// MOCK MENU ITEMS
// ============================================================================

export const mockMenuItems: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Nasi Goreng',
    description: 'Nasi goreng spesial dengan telur',
    category: 'Main Course',
    price: 25000,
    imageUrl: '/images/nasi-goreng.jpg',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'menu-2',
    name: 'Mie Goreng',
    description: 'Mie goreng ayam dengan sayuran',
    category: 'Main Course',
    price: 20000,
    imageUrl: '/images/mie-goreng.jpg',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'menu-3',
    name: 'Es Teh Manis',
    description: 'Teh manis dingin segar',
    category: 'Beverage',
    price: 5000,
    imageUrl: '/images/es-teh.jpg',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

// ============================================================================
// MOCK ORDERS
// ============================================================================

export const mockOrderItems: OrderItem[] = [
  {
    id: 'item-1',
    menuItemId: 'menu-1',
    menuItem: mockMenuItems[0],
    quantity: 2,
    price: 25000,
    subtotal: 50000,
  },
  {
    id: 'item-2',
    menuItemId: 'menu-3',
    menuItem: mockMenuItems[2],
    quantity: 1,
    price: 5000,
    subtotal: 5000,
  },
]

export const mockOrder: Order = {
  id: 'order-1',
  orderNumber: 'ORD-001',
  tableNumber: 5,
  items: mockOrderItems,
  status: 'PENDING',
  totalPrice: 55000,
  createdAt: '2024-01-01T10:00:00.000Z',
  updatedAt: '2024-01-01T10:00:00.000Z',
}

export const mockOrders: Order[] = [
  mockOrder,
  {
    id: 'order-2',
    orderNumber: 'ORD-002',
    tableNumber: 3,
    items: [mockOrderItems[0]],
    status: 'IN_PROGRESS',
    totalPrice: 50000,
    estimatedTime: 15,
    createdAt: '2024-01-01T10:05:00.000Z',
    updatedAt: '2024-01-01T10:10:00.000Z',
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-003',
    tableNumber: 7,
    items: [mockOrderItems[1]],
    status: 'COMPLETED',
    totalPrice: 5000,
    createdAt: '2024-01-01T09:30:00.000Z',
    updatedAt: '2024-01-01T09:45:00.000Z',
    completedAt: '2024-01-01T09:45:00.000Z',
  },
]
