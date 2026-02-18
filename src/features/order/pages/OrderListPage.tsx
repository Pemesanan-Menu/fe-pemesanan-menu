import { useState } from 'react'
import { useOrders } from '../hooks/useOrders'
import { orderService } from '../services/orderService'
import { Order } from '@/types'
import { getErrorMessage } from '@/types/error'
import { toast } from 'sonner'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { formatCurrency } from '@/utils/format'

export default function OrderListPage(): JSX.Element {
  const { orders, meta, isLoading, refetch } = useOrders()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)
  const [orderToPay, setOrderToPay] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCancel = (order: Order) => {
    setOrderToCancel(order)
    setShowCancelDialog(true)
  }

  const confirmCancel = async () => {
    if (!orderToCancel) return
    setIsSubmitting(true)
    try {
      await orderService.cancelOrder(orderToCancel.id)
      toast.success('Pesanan berhasil dibatalkan')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
      setShowCancelDialog(false)
      setOrderToCancel(null)
    }
  }

  const handlePayment = (order: Order) => {
    setOrderToPay(order)
    setShowPaymentDialog(true)
  }

  const confirmPayment = async () => {
    if (!orderToPay) return
    setIsSubmitting(true)
    try {
      await orderService.processPayment(orderToPay.id)
      toast.success('Pembayaran berhasil diproses')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
      setShowPaymentDialog(false)
      setOrderToPay(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400' }
      case 'DIPROSES': return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400' }
      case 'SELESAI': return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400' }
      case 'DIBATALKAN': return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400' }
      default: return { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-400' }
    }
  }

  const columns = [
    {
      header: 'Meja',
      accessor: (order: Order) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {order.table_number}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">Meja {order.table_number}</span>
        </div>
      ),
    },
    {
      header: 'Pelanggan',
      accessor: (order: Order) => (
        <span className="text-gray-900 dark:text-white">{order.table_number}</span>
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
      accessor: (order: Order) => {
        const colors = getStatusColor(order.status)
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
            {order.status === 'MENUNGGU' && 'Menunggu'}
            {order.status === 'DIPROSES' && 'Diproses'}
            {order.status === 'SELESAI' && 'Selesai'}
            {order.status === 'DIBATALKAN' && 'Dibatalkan'}
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
              Batalkan
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
          title="Manajemen Pesanan"
          description="Kelola pesanan dan status pembayaran"
        />

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="Belum ada pesanan"
          searchPlaceholder="Cari nomor meja atau status..."
          searchKeys={['table_number', 'status']}
          meta={meta}
          onPageChange={(page) => refetch(page)}
        />
      </div>

      {/* Payment Confirmation Dialog */}
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Proses pembayaran untuk pesanan Meja #{orderToPay?.table_number}?<br/>
              Total: <span className="font-bold text-gray-900 dark:text-white">{orderToPay && formatCurrency(orderToPay.total_price)}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPayment} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? 'Memproses...' : 'Konfirmasi Bayar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pesanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan pesanan dari Meja #{orderToCancel?.table_number}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel} 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Membatalkan...' : 'Ya, Batalkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
