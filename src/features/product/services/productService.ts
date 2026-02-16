import api from '@/services/api'
import { Product } from '@/types/product'

interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
}

interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  is_available?: boolean
}

export const productService = {
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: Product[] }>('/api/products')
    return data.data
  },

  create: async (productData: CreateProductRequest) => {
    const { data } = await api.post<{ success: boolean; data: Product }>('/api/products', productData)
    return data.data
  },

  update: async (id: string, productData: UpdateProductRequest) => {
    const { data } = await api.put<{ success: boolean; data: Product }>(`/api/products/${id}`, productData)
    return data.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/products/${id}`)
  },
}
