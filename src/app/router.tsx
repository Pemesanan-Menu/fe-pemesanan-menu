import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { Spinner } from '@/components/ui/spinner'

// ============================================================================
// LOADING FALLBACK
// ============================================================================

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-slate-600">Loading...</p>
      </div>
    </div>
  )
}

// ============================================================================
// CREATE ROUTER
// ============================================================================

export const router = createBrowserRouter(
  routes.map((route) => ({
    ...route,
    element: <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>,
  }))
)

// ============================================================================
// ROUTER PROVIDER COMPONENT
// ============================================================================

export function AppRouter() {
  return <RouterProvider router={router} />
}
