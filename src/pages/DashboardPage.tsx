import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { authUtils } from '@/utils/auth'
import { ICONS } from '@/config/menu'

export default function DashboardPage() {
  const user = authUtils.getUser()

  const stats = [
    {
      title: 'Total Pesanan Hari Ini',
      value: '24',
      icon: ICONS.clipboard,
      color: 'bg-blue-500',
    },
    {
      title: 'Pendapatan Hari Ini',
      value: 'Rp 2.450.000',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Menu Tersedia',
      value: '48',
      icon: ICONS.book,
      color: 'bg-purple-500',
    },
    {
      title: 'Meja Terisi',
      value: '8 / 15',
      icon: ICONS.table,
      color: 'bg-orange-500',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Selamat Datang, {user?.nama}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Berikut adalah ringkasan aktivitas Caffe Tetangga hari ini
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Pesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Meja #{item}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2 item • Rp 85.000</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
                      Diproses
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Menu Populer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Kopi Susu Tetangga', 'Nasi Goreng Spesial', 'Es Teh Manis'].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{12 - index * 2} pesanan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        +{(index + 1) * 15}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
