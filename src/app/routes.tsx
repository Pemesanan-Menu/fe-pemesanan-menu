import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

// ============================================================================
// LAZY LOADED PAGES
// ============================================================================

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },

  // Catch-all 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-xl text-slate-600 mb-8">Halaman tidak ditemukan</p>
        </div>
      </div>
    ),
  },
]
