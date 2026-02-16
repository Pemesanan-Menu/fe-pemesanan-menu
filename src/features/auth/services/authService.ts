import api from '@/services/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      role: string
      created_at: string
      updated_at: string
    }
    token: string
  }
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/api/auth/login', credentials)
    return data
  },
}
