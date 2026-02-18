import api from '@/services/api'
import { User, PaginatedData } from '@/types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: string
}

interface UpdateUserRequest {
  name?: string
  email?: string
  role?: string
}

export const userService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedData<User>> => {
    const { data } = await api.get<ApiResponse<PaginatedData<User>>>('/users', {
      params: { page, limit }
    })
    return data.data
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`)
    return data.data
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const { data } = await api.post<ApiResponse<User>>('/users', userData)
    return data.data
  },

  update: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, userData)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
