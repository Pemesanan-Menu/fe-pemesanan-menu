import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { mockAdmin, mockProduction } from '@/test/mockData'

describe('useAuth', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('logs in user successfully', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.login(mockAdmin, 'test-token-123')
    })

    expect(result.current.user).toEqual(mockAdmin)
    expect(result.current.isAuthenticated).toBe(true)
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token-123')
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockAdmin))
  })

  it('logs out user successfully', () => {
    const { result } = renderHook(() => useAuth())

    // Login first
    act(() => {
      result.current.login(mockAdmin, 'test-token-123')
    })

    expect(result.current.isAuthenticated).toBe(true)

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken')
    expect(localStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('returns token when available', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.login(mockAdmin, 'test-token-123')
    })

    // Mock localStorage.getItem to return the token
    vi.mocked(localStorage.getItem).mockReturnValue('test-token-123')

    const token = result.current.getToken()
    expect(token).toBe('test-token-123')
  })

  it('checks user role correctly', () => {
    // Setup localStorage mock to return proper user data
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockAdmin)
      if (key === 'authToken') return 'test-token'
      return null
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.hasRole('admin')).toBe(true)
    expect(result.current.hasRole(['admin', 'production'])).toBe(true)
    expect(result.current.hasRole('production')).toBe(false)
  })

  it('checks multiple roles correctly', () => {
    // Setup localStorage mock to return proper user data
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockProduction)
      if (key === 'authToken') return 'test-token'
      return null
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.hasRole(['admin', 'production'])).toBe(true)
    expect(result.current.hasRole(['admin', 'cashier'])).toBe(false)
  })

  it('returns false for role check when not authenticated', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.hasRole('admin')).toBe(false)
  })

  it('updates user data', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.login(mockAdmin, 'test-token')
    })

    act(() => {
      result.current.updateUser({ name: 'Updated Admin' })
    })

    expect(result.current.user?.name).toBe('Updated Admin')
    expect(result.current.user?.id).toBe(mockAdmin.id) // Other fields unchanged
  })
})
