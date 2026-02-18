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
      color: 'bg-blue-500',
    },
    {
      title: 'Pendapatan Hari Ini',
      value: isLoading ? '-' : formatCurrency(data?.revenue.today || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Pesanan Diproses',
      value: isLoading ? '-' : data?.order_stats.diproses.toString() || '0',
      icon: ICONS.book,
      color: 'bg-purple-500',
    },
    {
      title: 'Pesanan Selesai',
      value: isLoading ? '-' : data?.order_stats.selesai.toString() || '0',
      icon: ICONS.table,
      color: 'bg-orange-500',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
      case 'DIPROSES': return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
      case 'SELESAI': return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
      case 'DIBAYAR': return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Selamat Datang, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Berikut adalah ringkasan aktivitas Caffe Tetangga hari ini
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Pesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Memuat...</div>
              ) : data?.recent_orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Belum ada pesanan</div>
              ) : (
                <div className="space-y-4">
                  {data?.recent_orders.slice(0, 5).map((order) => (
                    <div key={order.order_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Meja #{order.table_number}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.item_count} item • {formatCurrency(order.total_price)}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Menu Populer</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Memuat...</div>
              ) : data?.top_products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Belum ada data</div>
              ) : (
                <div className="space-y-4">
                  {data?.top_products.slice(0, 5).map((product) => (
                    <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.product_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.total_sold} terjual</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
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
