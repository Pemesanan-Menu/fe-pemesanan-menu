export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  subtotal: number
}

export interface Order {
  id: string
  table_id: string
  table_number: number
  customer_name: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface CreateOrderRequest {
  table_id: string
  customer_name: string
  items: {
    product_id: string
    quantity: number
  }[]
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
}
