import api from '@/services/api'
import { Order, CreateOrderRequest, UpdateStatusRequest, PaginatedData } from '@/types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const orderService = {
  getAll: async (page = 1, limit = 10, tableId?: string, status?: string): Promise<PaginatedData<Order>> => {
    const params: Record<string, string> = { page: page.toString(), limit: limit.toString() }
    if (tableId) params.table_id = tableId
    if (status) params.status = status

    const { data } = await api.get<ApiResponse<PaginatedData<Order>>>('/orders', { params })
    return data.data
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`)
    return data.data
  },

  create: async (payload: CreateOrderRequest): Promise<Order> => {
    const { data } = await api.post<ApiResponse<Order>>('/orders', payload)
    return data.data
  },

  updateStatus: async (id: string, payload: UpdateStatusRequest): Promise<Order> => {
    const { data } = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, payload)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`)
  },
}
