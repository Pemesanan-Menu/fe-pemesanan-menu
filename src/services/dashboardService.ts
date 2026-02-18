import api from './api'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface DashboardData {
  revenue: {
    today: number
    this_week: number
    this_month: number
  }
  order_stats: {
    total_today: number
    menunggu: number
    diproses: number
    selesai: number
    dibayar: number
    dibatalkan: number
  }
  top_products: Array<{
    product_id: string
    product_name: string
    total_sold: number
    total_revenue: number
  }>
  recent_orders: Array<{
    order_id: string
    table_number: number
    item_count: number
    total_price: number
    status: string
    created_at: string
  }>
}

export const dashboardService = {
  getData: async (): Promise<DashboardData> => {
    const { data } = await api.get<ApiResponse<DashboardData>>('/dashboard')
    return data.data
  },
}
