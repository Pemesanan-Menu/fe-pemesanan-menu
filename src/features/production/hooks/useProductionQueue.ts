import { useState, useEffect, useRef } from 'react'
import { productionService } from '../services/productionService'
import { Order } from '@/types'

export function useProductionQueue(page = 1, limit = 100, status?: string) {
  const [items, setItems] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const hasFetched = useRef(false)

  const fetchQueue = async () => {
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
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchQueue()
  }, [page, limit, status])

  return {
    items,
    isLoading,
    total,
    refetch: fetchQueue,
  }
}
