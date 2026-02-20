import { useState, useEffect, useCallback } from 'react'
import { productionService } from '../services/productionService'
import { Order } from '@/types'

export function useProductionQueue(page = 1, limit = 100, status?: string): {
  items: Order[]
  isLoading: boolean
  total: number
  refetch: () => Promise<void>
} {
  const [items, setItems] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchQueue = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await productionService.getQueue(page, limit, status)
      setItems(data.items)
      setTotal(data.meta.total)
    } catch (error) {
      console.error('Failed to fetch production queue:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, status])

  useEffect(() => {
    // Initial fetch
    fetchQueue()

    // Setup SSE connection with auth
    const token = localStorage.getItem('authToken')
    if (!token) return

    // Build SSE URL from API base URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    // Ensure base URL doesn't end with slash
    const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl
    const sseUrl = `${baseUrl}/sse/production`
    
    let abortController = new AbortController()
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    let reconnectTimer: ReturnType<typeof setTimeout>
    
    const connectSSE = async () => {
      try {
        const response = await fetch(sseUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream',
          },
          signal: abortController.signal,
        })

        if (!response.ok) {
          console.error('❌ SSE Production connection failed:', response.status)
          scheduleReconnect()
          return
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) return

        reconnectAttempts = 0 // Reset on successful connection

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            scheduleReconnect()
            break
          }

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                JSON.parse(line.slice(6))
                fetchQueue()
              } catch (e) {
                // Ignore parse errors for heartbeat messages
              }
            }
          }
        }
      } catch (error: unknown) {
        if ((error as Error).name !== 'AbortError') {
          console.error('SSE Production error:', error)
          scheduleReconnect()
        }
      }
    }

    const scheduleReconnect = () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        return
      }
      
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
      reconnectAttempts++
      
      reconnectTimer = setTimeout(() => {
        abortController = new AbortController()
        connectSSE()
      }, delay)
    }

    connectSSE()

    return () => {
      clearTimeout(reconnectTimer)
      abortController.abort()
    }
  }, [fetchQueue])

  return {
    items,
    isLoading,
    total,
    refetch: fetchQueue,
  }
}
