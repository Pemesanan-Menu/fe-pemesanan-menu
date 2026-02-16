import api from '@/services/api'
import { ProductionItem, UpdateProductionStatusRequest } from '@/types/production'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const productionService = {
  getQueue: async (): Promise<ProductionItem[]> => {
    const { data } = await api.get<ApiResponse<ProductionItem[]>>('/production/queue')
    return data.data
  },

  updateStatus: async (id: string, payload: UpdateProductionStatusRequest): Promise<ProductionItem> => {
    const { data } = await api.patch<ApiResponse<ProductionItem>>(`/production/${id}/status`, payload)
    return data.data
  },
}
