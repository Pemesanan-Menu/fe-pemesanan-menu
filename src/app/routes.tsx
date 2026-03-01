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
const ProductionQueuePage = lazy(() => import('@/features/production/pages/ProductionQueuePage'))
const ExportOrdersPage = lazy(() => import('@/pages/ExportOrdersPage'))
const CashierPage = lazy(() => import('@/features/cashier/pages/CashierPage'))
const OrderPage = lazy(() => import('@/features/customer/pages/OrderPage'))
const CustomerOrdersPage = lazy(() => import('@/features/customer/pages/CustomerOrdersPage'))
const OrderTrackingPage = lazy(() => import('@/features/customer/pages/OrderTrackingPage'))

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
    element: <CashierPage />,
  },
  {
    path: '/cashier',
    element: <CashierPage />,
  },
  {
    path: '/production',
    element: <ProductionQueuePage />,
  },
  {
    path: '/export',
    element: <ExportOrdersPage />,
  },
  // Customer routes (public - no authentication)
  {
    path: '/order',
    element: <OrderPage />,
  },
  {
    path: '/customer/order',
    element: <OrderPage />,
  },
  {
    path: '/customer/orders',
    element: <CustomerOrdersPage />,
  },
  {
    path: '/customer/tracking/:orderId',
    element: <OrderTrackingPage />,
  },
  {
    path: '/tracking/:orderId',
    element: <OrderTrackingPage />,
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
