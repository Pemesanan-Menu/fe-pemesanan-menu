import { useState } from 'react'
import { useProductionQueue } from '../hooks/useProductionQueue'
import { productionService } from '../services/productionService'
import { Order, OrderStatus } from '@/types'
import { getErrorMessage } from '@/types/error'
import { toast } from 'sonner'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Modal } from '@/components/ui/modal'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProductionQueuePage(): JSX.Element {
  const { items, isLoading, refetch } = useProductionQueue()
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus>('MENUNGGU')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdateStatus = (item: Order) => {
    setEditingItem(item)
    setNewStatus(item.status)
    setShowStatusModal(true)
  }

  const handleSubmitStatus = async () => {
    if (!editingItem) return
    setIsSubmitting(true)
    try {
      await productionService.updateStatus(editingItem.id, { status: newStatus })
      toast.success('Status produksi berhasil diupdate')
      setShowStatusModal(false)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400' }
      case 'DIPROSES': return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400' }
      case 'SELESAI': return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400' }
      default: return { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-400' }
    }
  }

  const columns = [
    {
      header: 'Order',
      accessor: (item: Order) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Order #{item.id.slice(0, 8)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.items.length} items</p>
        </div>
      ),
    },
    {
      header: 'Meja',
      accessor: (item: Order) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {item.table_number}
          </div>
          <span className="text-gray-900 dark:text-white">Meja {item.table_number}</span>
        </div>
      ),
    },
    {
      header: 'Pelanggan',
      accessor: (item: Order) => (
        <span className="text-gray-900 dark:text-white">{item.table_number}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (item: Order) => {
        const colors = getStatusColor(item.status)
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
            {item.status === 'MENUNGGU' && 'Menunggu'}
            {item.status === 'DIPROSES' && 'Sedang Diproses'}
            {item.status === 'SELESAI' && 'Selesai'}
          </span>
        )
      },
    },
    {
      header: 'Waktu',
      accessor: (item: Order) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(item.created_at).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Antrian Produksi"
          description="Monitor dan update status produksi pesanan"
        />

        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          emptyMessage="Tidak ada antrian produksi"
          onEdit={handleUpdateStatus}
          searchPlaceholder="Cari produk atau pelanggan..."
          searchKeys={['table_number', 'table_number', 'table_number', 'status']}
        />
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Status Produksi">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={newStatus} onValueChange={(value: 'MENUNGGU' | 'DIPROSES' | 'SELESAI') => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmitStatus}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
