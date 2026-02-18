import type { User, Product, Order, OrderItem } from '@/types'

// ============================================================================
// MOCK USERS
// ============================================================================

export const mockAdmin: User = {
  id: 'user-admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

export const mockProduction: User = {
  id: 'user-prod-1',
  name: 'Production User',
  email: 'production@example.com',
  role: 'production',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

export const mockCashier: User = {
  id: 'user-cashier-1',
  name: 'Cashier User',
  email: 'cashier@example.com',
  role: 'cashier',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

// ============================================================================
// MOCK PRODUCTS
// ============================================================================

export const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Nasi Goreng',
    description: 'Nasi goreng spesial dengan telur',
    category: 'Main Course',
    price: 25000,
    stock: 50,
    image_url: '/images/nasi-goreng.jpg',
    is_available: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'product-2',
    name: 'Mie Goreng',
    description: 'Mie goreng ayam dengan sayuran',
    category: 'Main Course',
    price: 20000,
    stock: 30,
    image_url: '/images/mie-goreng.jpg',
    is_available: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'product-3',
    name: 'Es Teh Manis',
    description: 'Teh manis dingin segar',
    category: 'Beverage',
    price: 5000,
    stock: 100,
    image_url: '/images/es-teh.jpg',
    is_available: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
]

// ============================================================================
// MOCK ORDERS
// ============================================================================

export const mockOrderItems: OrderItem[] = [
  {
    id: 'item-1',
    order_id: 'order-1',
    product_id: 'product-1',
    product_name: 'Nasi Goreng',
    quantity: 2,
    price: 25000,
    subtotal: 50000,
  },
  {
    id: 'item-2',
    order_id: 'order-1',
    product_id: 'product-3',
    product_name: 'Es Teh Manis',
    quantity: 1,
    price: 5000,
    subtotal: 5000,
  },
]

export const mockOrder: Order = {
  id: 'order-1',
  order_number: 'ORD-001',
  table_id: 'table-1',
  table_number: 5,
  items: mockOrderItems,
  status: 'MENUNGGU',
  total_amount: 55000,
  total_price: 55000,
  created_at: '2024-01-01T10:00:00.000Z',
  updated_at: '2024-01-01T10:00:00.000Z',
}

export const mockOrders: Order[] = [
  mockOrder,
  {
    id: 'order-2',
    order_number: 'ORD-002',
    table_id: 'table-2',
    table_number: 3,
    items: [{
      ...mockOrderItems[0],
      order_id: 'order-2',
    }],
    status: 'DIPROSES',
    total_amount: 50000,
    total_price: 50000,
    estimated_minutes: 15,
    created_at: '2024-01-01T10:05:00.000Z',
    updated_at: '2024-01-01T10:10:00.000Z',
  },
  {
    id: 'order-3',
    order_number: 'ORD-003',
    table_id: 'table-3',
    table_number: 7,
    items: [{
      ...mockOrderItems[1],
      order_id: 'order-3',
    }],
    status: 'SELESAI',
    total_amount: 5000,
    total_price: 5000,
    created_at: '2024-01-01T09:30:00.000Z',
    updated_at: '2024-01-01T09:45:00.000Z',
  },
]
