import { useState, useEffect } from 'react'
import { orderService } from '../services/orderService'
import { Order } from '@/types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await orderService.getAll()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    isLoading,
    refetch: fetchOrders,
  }
}
