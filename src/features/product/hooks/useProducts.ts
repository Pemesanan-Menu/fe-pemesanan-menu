import { useState, useEffect, useCallback } from 'react'
import { Product, PaginationMeta } from '@/types'
import { productService } from '../services/productService'

export const useProducts = (category?: string): {
  products: Product[]
  meta: PaginationMeta | null
  isLoading: boolean
  error: string | null
  refetch: (page?: number, limit?: number) => Promise<void>
} => {
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (page = 1, limit = 10) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await productService.getAll(page, limit, undefined, category)
      setProducts(data.items)
      setMeta(data.meta)
    } catch (err) {
      setError('Gagal memuat data produk')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, meta, isLoading, error, refetch: fetchProducts }
}
