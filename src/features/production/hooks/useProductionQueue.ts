import { useState, useEffect, useRef, useCallback } from 'react'
import { productionService } from '../services/productionService'
import { Order } from '@/types'

export function useProductionQueue(page = 1, limit = 100, status?: string, autoRefresh = true, refreshInterval = 5000): {
  items: Order[]
  isLoading: boolean
  total: number
  refetch: () => Promise<void>
} {
  const [items, setItems] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const hasFetched = useRef(false)

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
    if (hasFetched.current) return
    hasFetched.current = true
    fetchQueue()
  }, [fetchQueue])

  // Auto-refresh mechanism
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchQueue()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchQueue])

  return {
    items,
    isLoading,
    total,
    refetch: fetchQueue,
  }
}
