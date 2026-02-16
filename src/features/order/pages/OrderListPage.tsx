import { useState } from 'react'
import { useOrders } from '../hooks/useOrders'
import { orderService } from '../services/orderService'
import { Order } from '@/types/order'
import { getErrorMessage } from '@/types/error'
import { toast } from 'sonner'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Modal } from '@/components/ui/modal'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/utils/format'

export default function OrderListPage() {
  const { orders, isLoading, refetch } = useOrders()
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<'pending' | 'processing' | 'completed' | 'cancelled'>('pending')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdateStatus = (order: Order) => {
    setEditingOrder(order)
    setNewStatus(order.status)
    setShowStatusModal(true)
  }

  const handleSubmitStatus = async () => {
    if (!editingOrder) return
    setIsSubmitting(true)
    try {
      await orderService.updateStatus(editingOrder.id, { status: newStatus })
      toast.success('Status pesanan berhasil diupdate')
      setShowStatusModal(false)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (order: Order) => {
    setOrderToDelete(order)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!orderToDelete) return
    try {
      await orderService.delete(orderToDelete.id)
      toast.success('Pesanan berhasil dihapus')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setShowDeleteDialog(false)
      setOrderToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400' }
      case 'processing': return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400' }
      case 'completed': return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400' }
      case 'cancelled': return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400' }
      default: return { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-400' }
    }
  }

  const columns = [
    {
      header: 'Meja',
      accessor: (order: Order) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {order.table_number}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">Meja {order.table_number}</span>
        </div>
      ),
    },
    {
      header: 'Pelanggan',
      accessor: (order: Order) => (
        <span className="text-gray-900 dark:text-white">{order.customer_name}</span>
      ),
    },
    {
      header: 'Total',
      accessor: (order: Order) => (
        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(order.total_amount)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (order: Order) => {
        const colors = getStatusColor(order.status)
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
            {order.status === 'pending' && 'Menunggu'}
            {order.status === 'processing' && 'Diproses'}
            {order.status === 'completed' && 'Selesai'}
            {order.status === 'cancelled' && 'Dibatalkan'}
          </span>
        )
      },
    },
    {
      header: 'Waktu',
      accessor: (order: Order) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.created_at).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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
          title="Manajemen Pesanan"
          description="Kelola pesanan dan status pembayaran"
        />

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="Belum ada pesanan"
          onEdit={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Status Pesanan">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={newStatus} onValueChange={(value: 'pending' | 'processing' | 'completed' | 'cancelled') => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="processing">Diproses</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pesanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pesanan dari <span className="font-semibold text-gray-900 dark:text-white">{orderToDelete?.customer_name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
