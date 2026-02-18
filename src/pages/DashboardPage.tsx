import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { authUtils } from '@/utils/auth'
import { ICONS } from '@/config/menu'
import { dashboardService, DashboardData } from '@/services/dashboardService'
import { formatCurrency } from '@/utils/format'

export default function DashboardPage() {
  const user = authUtils.getUser()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardService.getData()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      title: 'Total Pesanan Hari Ini',
      value: isLoading ? '-' : data?.order_stats.total_today.toString() || '0',
      icon: ICONS.clipboard,
      color: 'bg-blue-600',
    },
    {
      title: 'Pendapatan Hari Ini',
      value: isLoading ? '-' : formatCurrency(data?.revenue.today || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-600',
    },
    {
      title: 'Pesanan Diproses',
      value: isLoading ? '-' : data?.order_stats.diproses.toString() || '0',
      icon: ICONS.book,
      color: 'bg-purple-600',
    },
    {
      title: 'Pesanan Selesai',
      value: isLoading ? '-' : data?.order_stats.selesai.toString() || '0',
      icon: ICONS.table,
      color: 'bg-orange-600',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
      case 'DIPROSES': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
      case 'SELESAI': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
      case 'DIBAYAR': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
      default: return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return 'Menunggu'
      case 'DIPROSES': return 'Diproses'
      case 'SELESAI': return 'Selesai'
      case 'DIBAYAR': return 'Dibayar'
      case 'DIBATALKAN': return 'Dibatalkan'
      default: return status
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Selamat Datang, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Berikut adalah ringkasan aktivitas Caffe Tetangga hari ini
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold dark:text-white flex items-center gap-2">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                Pesanan Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  <p className="mt-2 text-sm text-gray-500">Memuat...</p>
                </div>
              ) : data?.recent_orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada pesanan</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Pesanan baru akan muncul di sini</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.recent_orders.slice(0, 5).map((order) => (
                    <div key={order.order_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">Meja #{order.table_number}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.item_count} item • {formatCurrency(order.total_price)}</p>
                      </div>
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold dark:text-white flex items-center gap-2">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                Menu Populer
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  <p className="mt-2 text-sm text-gray-500">Memuat...</p>
                </div>
              ) : data?.top_products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Menu populer akan muncul di sini</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.top_products.slice(0, 5).map((product, index) => (
                    <div key={product.product_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white mb-1">{product.product_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.total_sold} terjual</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(product.total_revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
