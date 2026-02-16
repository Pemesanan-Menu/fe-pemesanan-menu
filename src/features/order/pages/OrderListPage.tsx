import DashboardLayout from '@/components/layout/DashboardLayout'

export default function OrderListPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manajemen Pesanan</h1>
        <p className="text-gray-600 dark:text-gray-400">Kelola pesanan dan pembayaran</p>
      </div>
    </DashboardLayout>
  )
}
