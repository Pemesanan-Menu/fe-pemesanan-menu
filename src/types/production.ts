export interface ProductionItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  status: 'pending' | 'in_progress' | 'completed'
  table_number: number
  customer_name: string
  created_at: string
  updated_at: string
}

export interface UpdateProductionStatusRequest {
  status: 'pending' | 'in_progress' | 'completed'
}
