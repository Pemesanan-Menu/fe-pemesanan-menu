import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

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

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================================================
// RESPONSE INTERCEPTOR - Handle common errors
// ============================================================================

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401: {
          // Unauthorized - clear token only if not on login page or login endpoint
          const isLoginEndpoint = error.config?.url?.includes('/auth/login')
          const isLoginPage = window.location.pathname === '/login'
          
          // Skip handling if it's a login request failure or already on login page
          if (!isLoginEndpoint && !isLoginPage) {
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
          // If login endpoint or on login page, let the component handle the error
          break
        }

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
