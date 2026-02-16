export interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface UserListResponse extends ApiResponse<User[]> {}
