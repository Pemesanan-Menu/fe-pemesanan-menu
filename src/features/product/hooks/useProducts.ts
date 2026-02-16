import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import { productService } from '../services/productService'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError('Gagal memuat data produk')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, isLoading, error, refetch: fetchProducts }
}
