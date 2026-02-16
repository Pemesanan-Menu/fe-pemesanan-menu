import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ProductionQueuePage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Antrian Produksi</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor dan update status produksi</p>
      </div>
    </DashboardLayout>
  )
}
