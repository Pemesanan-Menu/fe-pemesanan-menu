import { useState, useEffect } from 'react'
import { Table } from '@/types/table'
import { tableService } from '../services/tableService'

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTables = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await tableService.getAll()
      setTables(data)
    } catch (err) {
      setError('Gagal memuat data meja')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  return { tables, isLoading, error, refetch: fetchTables }
}
