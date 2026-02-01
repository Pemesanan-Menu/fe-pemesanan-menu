// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole = 'admin' | 'production' | 'cashier' | 'customer'

export interface User {
  id: string
  username: string
  email?: string
  role: UserRole
  createdAt: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ============================================================================
// MENU TYPES
// ============================================================================

export interface MenuItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  order: number
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID' | 'CANCELLED'

export interface OrderItem {
  id: string
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  price: number
  subtotal: number
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  tableNumber: number
  items: OrderItem[]
  status: OrderStatus
  totalPrice: number
  estimatedTime?: number
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface CreateOrderDTO {
  tableNumber: number
  items: Array<{
    menuItemId: string
    quantity: number
    notes?: string
  }>
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus
  estimatedTime?: number
}

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Table {
  id: string
  tableNumber: number
  capacity: number
  qrCode: string
  isActive: boolean
  createdAt: string
}

// ============================================================================
// CART TYPES (Frontend Only)
// ============================================================================

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

// ============================================================================
// PRODUCTION TYPES
// ============================================================================

export interface ProductionOrder extends Order {
  priority: number
  assignedTo?: string
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
  id: string
  orderId: string
  amount: number
  paymentMethod: 'CASH' | 'CARD' | 'E_WALLET'
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  paidAt?: string
  createdAt: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: RequestStatus
  error: string | null
}
