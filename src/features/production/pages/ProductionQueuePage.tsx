import { useState, useEffect } from 'react'
import { useProductionQueue } from '../hooks/useProductionQueue'
import { productionService } from '../services/productionService'
import { Order, OrderStatus, UpdateStatusRequest } from '@/types'
import { getErrorMessage } from '@/types/error'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Modal } from '@/components/ui/modal'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProductionQueuePage(): JSX.Element {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const { items, isLoading, refetch } = useProductionQueue(1, 100, undefined, autoRefresh, 10000)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus>('MENUNGGU')
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Update timestamp when items change
  useEffect(() => {
    if (items.length > 0) {
      setLastUpdate(new Date())
    }
  }, [items])

  // Sort: MENUNGGU first, then DIPROSES, then SELESAI
  const sortedItems = [...items].sort((a, b) => {
    const statusOrder: Record<OrderStatus, number> = { 
      MENUNGGU: 0, 
      DIPROSES: 1, 
      SELESAI: 2,
      SIAP: 3,
      DIBATALKAN: 4
    }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const handleUpdateStatus = (item: Order) => {
    setEditingItem(item)
    setNewStatus(item.status)
    setEstimatedMinutes(item.estimated_minutes || 15)
    setShowStatusModal(true)
  }

  const handleSubmitStatus = async () => {
    if (!editingItem) return
    setIsSubmitting(true)
    try {
      const orderId = editingItem.order_id || editingItem.id
      const payload: UpdateStatusRequest = { status: newStatus }
      if (newStatus === 'DIPROSES') {
        payload.estimated_minutes = estimatedMinutes
      }
      await productionService.updateStatus(orderId, payload)
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
      accessor: (item: Order) => {
        const orderId = item.order_id || item.id
        const displayId = orderId ? orderId.slice(0, 8) : 'N/A'
        return (
          <div className="flex items-center gap-2">
            {item.status === 'MENUNGGU' && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Order #{displayId}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.item_count || item.items?.length || 0} items</p>
            </div>
          </div>
        )
      },
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
          <div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
              {item.status === 'MENUNGGU' && 'Menunggu'}
              {item.status === 'DIPROSES' && 'Sedang Diproses'}
              {item.status === 'SELESAI' && 'Selesai'}
            </span>
            {item.status === 'DIPROSES' && item.estimated_minutes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ⏱️ ~{item.estimated_minutes} menit
              </p>
            )}
          </div>
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
        <div className="flex items-center justify-between">
          <PageHeader
            title="Antrian Produksi"
            description="Monitor dan update status produksi pesanan"
          />
          
          <div className="flex items-center gap-3">
            {/* Auto-refresh indicator */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              <div className="text-xs">
                <p className="font-medium text-gray-900 dark:text-white">
                  {autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Toggle button */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {autoRefresh ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={sortedItems}
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
                {editingItem?.status === 'MENUNGGU' && (
                  <>
                    <SelectItem value="MENUNGGU">Menunggu</SelectItem>
                    <SelectItem value="DIPROSES">Sedang Diproses</SelectItem>
                  </>
                )}
                {editingItem?.status === 'DIPROSES' && (
                  <>
                    <SelectItem value="DIPROSES">Sedang Diproses</SelectItem>
                    <SelectItem value="SELESAI">Selesai</SelectItem>
                  </>
                )}
                {editingItem?.status === 'SELESAI' && (
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {newStatus === 'DIPROSES' && (
            <div className="space-y-2">
              <Label>Estimasi Waktu (menit)</Label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Contoh: 15"
              />
            </div>
          )}

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
