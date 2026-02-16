import { STORAGE_KEYS } from '@/config/constants'

interface User {
  id: string
  nama: string
  username: string
  role: string
}

export const authUtils = {
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken()
  },

  logout: (): void => {
    authUtils.removeToken()
    authUtils.removeUser()
  },

  hasRole: (allowedRoles: readonly string[]): boolean => {
    const user = authUtils.getUser()
    if (!user) return false
    if (allowedRoles.length === 0) return true
    return allowedRoles.includes(user.role)
  },
}
