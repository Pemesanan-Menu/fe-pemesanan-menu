import api from './api'

export const exportService = {
  exportOrders: async (format: 'csv' | 'pdf', from: string, to: string, status?: string): Promise<Blob> => {
    const params: Record<string, string> = { format, from, to }
    if (status) params.status = status

    const { data } = await api.get('/export/orders', {
      params,
      responseType: 'blob',
    })
    return data
  },
}
