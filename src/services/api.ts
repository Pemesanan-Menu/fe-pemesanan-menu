import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const IS_DEBUG = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true'

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================================
// REQUEST INTERCEPTOR - Inject authentication token
// ============================================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken')

    // Inject token if available
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Debug logging in development
    if (IS_DEBUG) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    if (IS_DEBUG) {
      console.error('❌ Request Error:', error)
    }
    return Promise.reject(error)
  }
)

// ============================================================================
// RESPONSE INTERCEPTOR - Handle common errors
// ============================================================================

api.interceptors.response.use(
  (response) => {
    // Debug logging in development
    if (IS_DEBUG) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }

    return response
  },
  (error: AxiosError) => {
    // Debug logging in development
    if (IS_DEBUG) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      })
    }

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          // Unauthorized - clear token only if not on login page
          if (window.location.pathname !== '/login') {
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
          // If on login page, let the component handle the error
          break

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden. Insufficient permissions.')
          break

        case 404:
          // Not found
          console.error('Resource not found.')
          break

        case 500:
          // Server error
          console.error('Internal server error. Please try again later.')
          break

        case 503:
          // Service unavailable
          console.error('Service temporarily unavailable. Please try again later.')
          break

        default:
          console.error('An error occurred:', error.message)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server. Please check your connection.')
    } else {
      // Something else happened
      console.error('Request failed:', error.message)
    }

    return Promise.reject(error)
  }
)

// ============================================================================
// EXPORT
// ============================================================================

export default api
