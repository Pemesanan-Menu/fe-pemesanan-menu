import axios from 'axios'
import { Product, Order, CreateOrderRequest, TrackingResponse, Table, PaginatedData } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.caffe-tetangga.me/api'

// Public API client (no authentication)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const customerService = {
  // Get public menu
  getMenu: async (page = 1, limit = 100, search?: string, category?: string): Promise<PaginatedData<Product>> => {
    const params: Record<string, string> = { page: page.toString(), limit: limit.toString() }
    if (search) params.search = search
    if (category && category !== 'Semua') params.category = category

    const { data } = await publicApi.get<ApiResponse<PaginatedData<Product>>>('/menu', { params })
    return data.data
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    const { data } = await publicApi.get<ApiResponse<string[]>>('/categories')
    return data.data
  },

  // Validate table by number
  validateTable: async (tableNumber: number): Promise<Table> => {
    const { data } = await publicApi.get<ApiResponse<Table>>('/tables/validate', {
      params: { number: tableNumber }
    })
    return data.data
  },

  // Create order (public)
  createOrder: async (payload: CreateOrderRequest): Promise<Order> => {
    const { data } = await publicApi.post<ApiResponse<Order>>('/orders', payload)
    return data.data
  },

  // Track order (public)
  trackOrder: async (orderId: string): Promise<TrackingResponse> => {
    const { data } = await publicApi.get<ApiResponse<TrackingResponse>>(`/orders/${orderId}/tracking`)
    return data.data
  },
}
