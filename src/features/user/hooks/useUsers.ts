import { useState, useEffect } from 'react'
import { User } from '@/types/user'
import { userService } from '../services/userService'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await userService.getAll()
      setUsers(data)
    } catch (err) {
      setError('Gagal memuat data pengguna')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, isLoading, error, refetch: fetchUsers }
}
