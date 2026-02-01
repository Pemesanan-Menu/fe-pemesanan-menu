import { AxiosResponse } from 'axios'
import api from './api'
import type { ApiResponse } from '@/types'

// ============================================================================
// HTTP SERVICE - Generic type-safe HTTP methods
// ============================================================================

export const http = {
  /**
   * GET request
   * @param url - Endpoint URL
   * @param params - Query parameters
   * @returns Promise with typed response data
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(url, { params })
    return response.data.data
  },

  /**
   * POST request
   * @param url - Endpoint URL
   * @param data - Request body
   * @returns Promise with typed response data
   */
  async post<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data)
    return response.data.data
  },

  /**
   * PUT request
   * @param url - Endpoint URL
   * @param data - Request body
   * @returns Promise with typed response data
   */
  async put<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data)
    return response.data.data
  },

  /**
   * PATCH request
   * @param url - Endpoint URL
   * @param data - Request body
   * @returns Promise with typed response data
   */
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await api.patch(url, data)
    return response.data.data
  },

  /**
   * DELETE request
   * @param url - Endpoint URL
   * @returns Promise with typed response data
   */
  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await api.delete(url)
    return response.data.data
  },
}

// ============================================================================
// RAW HTTP - For non-standard API responses
// ============================================================================

export const rawHttp = {
  /**
   * Raw GET request (returns full axios response)
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return api.get<T>(url, { params })
  },

  /**
   * Raw POST request (returns full axios response)
   */
  async post<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    return api.post<T>(url, data)
  },

  /**
   * Raw PUT request (returns full axios response)
   */
  async put<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    return api.put<T>(url, data)
  },

  /**
   * Raw DELETE request (returns full axios response)
   */
  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return api.delete<T>(url)
  },
}

export default http
