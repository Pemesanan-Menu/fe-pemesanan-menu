import { useState, useEffect } from 'react'
import { productionService } from '../services/productionService'
import { ProductionItem } from '@/types/production'

export function useProductionQueue() {
  const [items, setItems] = useState<ProductionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    fetchQueue()
  }, [])

  return {
    items,
    isLoading,
    refetch: fetchQueue,
  }
}
