import api from '@/services/api'
import { Order, UpdateStatusRequest, ProductionLog, PaginatedData } from '@/types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const productionService = {
  getQueue: async (page = 1, limit = 10, status?: string): Promise<PaginatedData<Order>> => {
    const params: Record<string, string> = { page: page.toString(), limit: limit.toString() }
    if (status) params.status = status

    const { data } = await api.get<ApiResponse<PaginatedData<Order>>>('/production/queue', { params })
    return data.data
  },

  updateStatus: async (id: string, payload: UpdateStatusRequest): Promise<ProductionLog> => {
    const { data } = await api.patch<ApiResponse<ProductionLog>>(`/production/orders/${id}`, payload)
    return data.data
  },

  getLogs: async (id: string): Promise<ProductionLog[]> => {
    const { data } = await api.get<ApiResponse<ProductionLog[]>>(`/production/orders/${id}/logs`)
    return data.data
  },
}
