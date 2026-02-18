// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole = 'admin' | 'production' | 'cashier' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  image_url: string
  is_available: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus = 'MENUNGGU' | 'DIPROSES' | 'SIAP' | 'SELESAI' | 'DIBATALKAN'
export type PaymentStatus = 'PENDING' | 'PAID'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product // Nested product data (public endpoints)
  product_name?: string // For backward compatibility
  quantity: number
  price: number
  subtotal: number
  notes?: string
}

export interface Order {
  id: string
  order_number: string
  table_id: string
  table?: Table // Nested table data
  table_number?: number // For backward compatibility
  status: OrderStatus
  payment_status?: PaymentStatus
  total_amount: number
  total_price?: number // For backward compatibility
  estimated_minutes?: number
  notes?: string
  items: OrderItem[]
  paid_at?: string
  cancelled_by?: string
  created_at: string
  updated_at: string
}

export interface CreateOrderRequest {
  table_id: string
  notes?: string
  items: Array<{
    product_id: string
    quantity: number
    notes?: string
  }>
}

export interface TrackingResponse {
  order_id: string
  status: OrderStatus
  items: Array<{
    id: string
    order_id: string
    product_id: string
    product_name: string
    quantity: number
    subtotal: number
  }>
  created_at: string
}

export interface ReceiptItem {
  product_name: string
  quantity: number
  subtotal: number
  notes?: string
}

export interface ReceiptResponse {
  order_id: string
  table_number: number
  status: OrderStatus
  total_price: number
  notes?: string
  items: ReceiptItem[]
  ordered_at: string
  paid_at?: string
}

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Table {
  id: string
  number: number
  qr_code_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// PRODUCTION TYPES
// ============================================================================

export interface UpdateStatusRequest {
  status: OrderStatus
  estimated_minutes?: number
}

export interface ProductionLog {
  id: string
  order_id: string
  previous_status: OrderStatus
  new_status: OrderStatus
  changed_by: string
  changed_at: string
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface RevenueStats {
  today: number
  this_week: number
  this_month: number
}

export interface OrderStats {
  total_today: number
  menunggu: number
  diproses: number
  selesai: number
  dibayar: number
  dibatalkan: number
}

export interface TopProduct {
  product_id: string
  product_name: string
  total_sold: number
  total_revenue: number
}

export interface RecentOrder {
  order_id: string
  table_number: number
  status: OrderStatus
  total_price: number
  item_count: number
  created_at: string
}

export interface DashboardResponse {
  revenue: RevenueStats
  order_stats: OrderStats
  top_products: TopProduct[]
  recent_orders: RecentOrder[]
}

// ============================================================================
// CART TYPES (Frontend Only)
// ============================================================================

export interface CartItem {
  product: Product
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

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface PaginatedData<T> {
  items: T[]
  meta: PaginationMeta
}

export interface ErrorResponse {
  success: boolean
  message: string
  errors?: Record<string, string>
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
