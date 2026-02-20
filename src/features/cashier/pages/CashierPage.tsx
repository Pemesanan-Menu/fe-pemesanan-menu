import { useState } from 'react'
import { useOrders } from '../../order/hooks/useOrders'
import { orderService } from '../../order/services/orderService'
import { Order } from '@/types'
import { getErrorMessage } from '@/types/error'
import { toast } from 'sonner'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Modal } from '@/components/ui/modal'
import { formatCurrency } from '@/utils/format'

export default function CashierPage(): JSX.Element {
  const { orders, meta, isLoading, refetch } = useOrders()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = (order: Order) => {
    setSelectedOrder(order)
    setShowPaymentModal(true)
  }

  const confirmPayment = async () => {
    if (!selectedOrder) return
    setIsProcessing(true)
    try {
      await orderService.processPayment(selectedOrder.id)
      toast.success('Pembayaran berhasil diproses')
      setShowPaymentModal(false)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = async (order: Order) => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return
    try {
      await orderService.cancelOrder(order.id)
      toast.success('Pesanan berhasil dibatalkan')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      case 'DIPROSES': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
      case 'SELESAI': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      case 'DIBAYAR': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
      case 'DIBATALKAN': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
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

  const columns = [
    {
      header: 'Meja',
      accessor: (order: Order) => (
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          {order.table_number}
        </div>
      ),
    },
    {
      header: 'Item Pesanan',
      accessor: (order: Order) => (
        <div className="space-y-1">
          {order.items?.slice(0, 2).map((item, idx) => (
            <div key={idx} className="text-sm text-gray-900 dark:text-white">
              {item.quantity}x {item.product_name}
            </div>
          ))}
          {order.items && order.items.length > 2 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +{order.items.length - 2} item lainnya
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Total',
      accessor: (order: Order) => (
        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(order.total_price)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (order: Order) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      ),
    },
    {
      header: 'Waktu',
      accessor: (order: Order) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.created_at).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Aksi',
      accessor: (order: Order) => (
        <div className="flex gap-2">
          {order.status === 'SELESAI' && (
            <button
              onClick={() => handlePayment(order)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Bayar
            </button>
          )}
          {order.status === 'MENUNGGU' && (
            <button
              onClick={() => handleCancel(order)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Kasir - Pesanan"
          description="Kelola pembayaran pesanan pelanggan"
        />

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="Belum ada pesanan"
          searchPlaceholder="Cari nomor meja..."
          searchKeys={['table_number', 'status']}
          meta={meta}
          onPageChange={(page) => refetch(page)}
        />
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Konfirmasi Pembayaran">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Meja</span>
                <span className="font-semibold text-gray-900 dark:text-white">Meja {selectedOrder.table_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Jumlah Item</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrder.items?.length || 0} item</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-900 dark:text-white font-semibold">Total Bayar</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(selectedOrder.total_price)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmPayment}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Memproses...' : 'Konfirmasi Bayar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
