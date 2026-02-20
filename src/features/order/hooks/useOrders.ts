import { useState, useEffect} from 'react'
import { orderService } from '../services/orderService'
import { Order, PaginationMeta } from '@/types'

export function useOrders(): {
  orders: Order[]
  meta: PaginationMeta | null
  isLoading: boolean
  refetch: (page?: number) => Promise<void>
} {
  const [orders, setOrders] = useState<Order[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true)
      const response = await orderService.getAll(page)
      setOrders(response.items)
      setMeta(response.meta)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchOrders()

    // Setup SSE connection with auth
    const token = localStorage.getItem('authToken')
    if (!token) return

    // Build SSE URL from API base URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    // Ensure base URL doesn't end with slash
    const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl
    const sseUrl = `${baseUrl}/sse/cashier`
    
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
          console.error('SSE Cashier connection failed:', response.status)
          scheduleReconnect()
          return
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) return

        reconnectAttempts = 0

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
                fetchOrders()
              } catch (e) {
                // Ignore parse errors for heartbeat messages
              }
            }
          }
        }
      } catch (error: unknown) {
        if ((error as Error).name !== 'AbortError') {
          console.error('SSE Cashier error:', error)
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
  }, [])

  return {
    orders,
    meta,
    isLoading,
    refetch: fetchOrders,
  }
}
