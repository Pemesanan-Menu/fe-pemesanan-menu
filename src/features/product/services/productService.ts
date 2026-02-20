import api from '@/services/api'
import { Product, PaginatedData, PaginationMeta } from '@/types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
  stock: number
}

interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  stock?: number
  is_available?: boolean
}

export const productService = {
  getAll: async (page = 1, limit = 10, search?: string, category?: string): Promise<{ items: Product[], meta: PaginationMeta }> => {
    const params: Record<string, string | number> = { page, limit }
    if (search) params.search = search
    if (category) params.category = category
    
    const { data } = await api.get<ApiResponse<PaginatedData<Product>>>('/products', { params })
    return { items: data.data.items || [], meta: data.data.meta }
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`)
    return data.data
  },

  create: async (productData: CreateProductRequest): Promise<Product> => {
    const { data } = await api.post<ApiResponse<Product>>('/products', productData)
    return data.data
  },

  update: async (id: string, productData: UpdateProductRequest): Promise<Product> => {
    const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, productData)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`)
  },
}
