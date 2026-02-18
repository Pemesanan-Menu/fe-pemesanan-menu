import { useState, useEffect, useRef } from 'react'
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
  const hasFetched = useRef(false)

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
    if (hasFetched.current) return
    hasFetched.current = true
    fetchOrders()
  }, [])

  return {
    orders,
    meta,
    isLoading,
    refetch: fetchOrders,
  }
}
