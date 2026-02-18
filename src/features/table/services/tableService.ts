import api from '@/services/api'
import { Table, PaginatedData } from '@/types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface CreateTableRequest {
  number: number
}

interface UpdateTableRequest {
  number?: number
  is_active?: boolean
}

export const tableService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedData<Table>> => {
    const { data } = await api.get<ApiResponse<PaginatedData<Table>>>('/tables', {
      params: { page, limit }
    })
    return data.data
  },

  getById: async (id: string): Promise<Table> => {
    const { data } = await api.get<ApiResponse<Table>>(`/tables/${id}`)
    return data.data
  },

  create: async (tableData: CreateTableRequest): Promise<Table> => {
    const { data } = await api.post<ApiResponse<Table>>('/tables', tableData)
    return data.data
  },

  update: async (id: string, tableData: UpdateTableRequest): Promise<Table> => {
    const { data } = await api.put<ApiResponse<Table>>(`/tables/${id}`, tableData)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tables/${id}`)
  },

  downloadQRCode: async (id: string, tableNumber: number): Promise<void> => {
    const { data } = await api.get(`/tables/${id}/qrcode`, {
      responseType: 'blob',
    })
    
    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `qrcode-meja-${tableNumber}.png`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  getQRCodeUrl: (id: string): string => {
    return `${api.defaults.baseURL}/tables/${id}/qrcode`
  },
}
