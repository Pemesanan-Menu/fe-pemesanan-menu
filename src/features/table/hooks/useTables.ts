import { useState, useEffect, useRef } from 'react'
import { Table, PaginationMeta } from '@/types'
import { tableService } from '../services/tableService'

export const useTables = (): {
  tables: Table[]
  meta: PaginationMeta | null
  isLoading: boolean
  error: string | null
  refetch: (page?: number) => Promise<void>
} => {
  const [tables, setTables] = useState<Table[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  const fetchTables = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await tableService.getAll(page)
      setTables(response.items)
      setMeta(response.meta)
    } catch (err) {
      setError('Gagal memuat data meja')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchTables()
  }, [])

  return { tables, meta, isLoading, error, refetch: fetchTables }
}
