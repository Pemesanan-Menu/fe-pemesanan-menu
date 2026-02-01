import type { RouteObject } from 'react-router-dom'

// ============================================================================
// LAZY LOADED PAGES
// ============================================================================

// TODO: Import your pages here when created
// Example:
// const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

export const routes: RouteObject[] = [
  // TODO: Define your routes here when pages are created

  // Example routes structure:
  // {
  //   path: '/login',
  //   element: <LoginPage />,
  // },

  // Catch-all 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-xl text-slate-600 mb-8">Halaman tidak ditemukan</p>
          <p className="text-sm text-slate-500">
            Silakan buat halaman dan routes sesuai kebutuhan
          </p>
        </div>
      </div>
    ),
  },
]
