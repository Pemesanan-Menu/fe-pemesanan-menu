import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

// ============================================================================
// LAZY LOADED PAGES
// ============================================================================

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const UserListPage = lazy(() => import('@/features/user/pages/UserListPage'))
const ProductListPage = lazy(() => import('@/features/product/pages/ProductListPage'))
const TableListPage = lazy(() => import('@/features/table/pages/TableListPage'))
const OrderListPage = lazy(() => import('@/features/order/pages/OrderListPage'))
const ProductionQueuePage = lazy(() => import('@/features/production/pages/ProductionQueuePage'))
const ExportOrdersPage = lazy(() => import('@/pages/ExportOrdersPage'))

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
  {
    path: '/users',
    element: <UserListPage />,
  },
  {
    path: '/products',
    element: <ProductListPage />,
  },
  {
    path: '/tables',
    element: <TableListPage />,
  },
  {
    path: '/orders',
    element: <OrderListPage />,
  },
  {
    path: '/production',
    element: <ProductionQueuePage />,
  },
  {
    path: '/export',
    element: <ExportOrdersPage />,
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
