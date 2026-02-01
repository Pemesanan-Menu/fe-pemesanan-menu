import { useState, useEffect, useCallback } from 'react'
import type { User, UserRole } from '@/types'

// ============================================================================
// AUTH STORAGE KEYS
// ============================================================================

const AUTH_TOKEN_KEY = 'authToken'
const USER_DATA_KEY = 'user'

// ============================================================================
// USEAUTH HOOK
// ============================================================================

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage
    const storedUser = localStorage.getItem(USER_DATA_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY)
  })

  // ============================================================================
  // LOGIN
  // ============================================================================

  const login = useCallback((userData: User, token: string) => {
    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))

    // Update state
    setUser(userData)
    setIsAuthenticated(true)
  }, [])

  // ============================================================================
  // LOGOUT
  // ============================================================================

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)

    // Clear state
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  // ============================================================================
  // GET TOKEN
  // ============================================================================

  const getToken = useCallback((): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }, [])

  // ============================================================================
  // CHECK ROLE
  // ============================================================================

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false

      const allowedRoles = Array.isArray(roles) ? roles : [roles]
      return allowedRoles.includes(user.role)
    },
    [user]
  )

  // ============================================================================
  // UPDATE USER
  // ============================================================================

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null

      const newUser = { ...prevUser, ...updatedUser }
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser))
      return newUser
    })
  }, [])

  // ============================================================================
  // SYNC WITH LOCALSTORAGE (for multi-tab support)
  // ============================================================================

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY) {
        if (e.newValue) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      }

      if (e.key === USER_DATA_KEY && e.newValue) {
        setUser(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    user,
    isAuthenticated,
    login,
    logout,
    getToken,
    hasRole,
    updateUser,
  }
}

// ============================================================================
// EXPORT TYPE
// ============================================================================

export type UseAuthReturn = ReturnType<typeof useAuth>
