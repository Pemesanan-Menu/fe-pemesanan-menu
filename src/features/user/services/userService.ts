import api from '@/services/api'
import { User } from '@/types/user'

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
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: User[] }>('/api/users')
    return data.data
  },

  create: async (userData: CreateUserRequest) => {
    const { data } = await api.post<{ success: boolean; data: User }>('/api/users', userData)
    return data.data
  },

  update: async (id: string, userData: UpdateUserRequest) => {
    const { data } = await api.put<{ success: boolean; data: User }>(`/api/users/${id}`, userData)
    return data.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/users/${id}`)
  },
}
