import { useState, useEffect, useRef } from 'react'
import { productionService } from '../services/productionService'
import { Order } from '@/types'

export function useProductionQueue() {
  const [items, setItems] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasFetched = useRef(false)

  const fetchQueue = async () => {
    try {
      setIsLoading(true)
      const data = await productionService.getQueue()
      setItems(data)
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
  }, [])

  return {
    items,
    isLoading,
    refetch: fetchQueue,
  }
}
