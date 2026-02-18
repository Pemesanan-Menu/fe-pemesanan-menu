import { useState, useEffect, useRef } from 'react'
import { User, PaginationMeta } from '@/types'
import { userService } from '../services/userService'

export const useUsers = (): {
  users: User[]
  meta: PaginationMeta | null
  isLoading: boolean
  error: string | null
  refetch: (page?: number) => Promise<void>
} => {
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userService.getAll(page)
      setUsers(response.items)
      setMeta(response.meta)
    } catch (err) {
      setError('Gagal memuat data pengguna')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchUsers()
  }, [])

  return { users, meta, isLoading, error, refetch: fetchUsers }
}
