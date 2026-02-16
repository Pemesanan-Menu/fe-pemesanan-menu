import api from '@/services/api'
import { Table } from '@/types/table'

interface CreateTableRequest {
  number: number
}

interface UpdateTableRequest {
  number?: number
  is_active?: boolean
}

export const tableService = {
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: Table[] }>('/api/tables')
    return data.data
  },

  create: async (tableData: CreateTableRequest) => {
    const { data } = await api.post<{ success: boolean; data: Table }>('/api/tables', tableData)
    return data.data
  },

  update: async (id: string, tableData: UpdateTableRequest) => {
    const { data } = await api.put<{ success: boolean; data: Table }>(`/api/tables/${id}`, tableData)
    return data.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/tables/${id}`)
  },

  downloadQRCode: (id: string) => {
    return `${api.defaults.baseURL}/api/tables/${id}/qrcode`
  },
}
