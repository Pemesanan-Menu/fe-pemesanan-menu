export interface ApiError {
  response?: {
    data?: {
      success: boolean
      message?: string
      errors?: Record<string, string>
    }
    status?: number
  }
  message?: string
}

export const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError
  return apiError.response?.data?.message || apiError.message || 'Terjadi kesalahan'
}

export const getFieldErrors = (error: unknown): Record<string, string> => {
  const apiError = error as ApiError
  return apiError.response?.data?.errors || {}
}
