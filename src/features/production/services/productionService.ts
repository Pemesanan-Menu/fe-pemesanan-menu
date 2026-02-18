import api from '@/services/api'
import { Order, UpdateStatusRequest, ProductionLog, PaginatedData } from '@/types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const productionService = {
  getQueue: async (): Promise<Order[]> => {
    const { data } = await api.get<ApiResponse<PaginatedData<Order>>>('/production/queue', {
      params: { limit: 100 }
    })
    return data.data.items || []
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
