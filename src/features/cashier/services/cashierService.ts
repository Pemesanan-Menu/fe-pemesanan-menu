import api from '@/services/api'

interface ApiResponse {
  success: boolean
  message: string
}

export const cashierService = {
  processPayment: async (orderId: string): Promise<void> => {
    await api.patch<ApiResponse>(`/orders/${orderId}/pay`)
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await api.patch<ApiResponse>(`/orders/${orderId}/cancel`)
  },
}
