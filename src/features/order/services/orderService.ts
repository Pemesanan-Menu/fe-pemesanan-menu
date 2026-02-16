import api from '@/services/api'
import { Order, CreateOrderRequest, UpdateOrderStatusRequest } from '@/types/order'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders')
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

  updateStatus: async (id: string, payload: UpdateOrderStatusRequest): Promise<Order> => {
    const { data } = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, payload)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`)
  },
}
