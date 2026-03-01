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
  const [activeTab, setActiveTab] = useState<'active' | 'paid'>('active')
  const statusFilter = activeTab === 'active' ? undefined : 'DIBAYAR'
  const { orders, meta, isLoading, refetch } = useOrders(statusFilter)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')

  const handlePayment = (order: Order) => {
    setSelectedOrder(order)
    setPaymentAmount('')
    setShowPaymentModal(true)
  }

  const confirmPayment = async () => {
    if (!selectedOrder) return
    setIsProcessing(true)
    try {
      await orderService.processPayment(selectedOrder.id)
      toast.success('Pembayaran berhasil diproses')
      setShowPaymentModal(false)
      
      // Auto-print receipt
      printReceipt(selectedOrder.id)
      
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsProcessing(false)
    }
  }

  const printReceipt = async (orderId: string) => {
    try {
      const receipt = await orderService.getReceipt(orderId)
      
      // Create print content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Struk Pembayaran</title>
          <style>
            @media print {
              @page { margin: 0; size: 80mm auto; }
              body { margin: 0; }
            }
            body { 
              font-family: 'Courier New', monospace; 
              width: 280px; 
              margin: 10px auto; 
              padding: 10px;
              font-size: 12px;
            }
            h2 { text-align: center; margin: 10px 0; font-size: 16px; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .item { margin: 5px 0; }
            .total { font-weight: bold; font-size: 14px; margin-top: 10px; }
            .center { text-align: center; }
            .small { font-size: 10px; }
          </style>
        </head>
        <body>
          <h2>STRUK PEMBAYARAN</h2>
          <div class="center small">Caffe Tetangga</div>
          <div class="divider"></div>
          <div class="row">
            <span>Order ID:</span>
            <span>${receipt.order_id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="row">
            <span>Meja:</span>
            <span>${receipt.table_number}</span>
          </div>
          <div class="row">
            <span>Tanggal:</span>
            <span>${new Date(receipt.paid_at || receipt.ordered_at).toLocaleString('id-ID', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
          <div class="divider"></div>
          ${receipt.items.map(item => `
            <div class="item">
              <div class="row">
                <span>${item.quantity}x ${item.product_name}</span>
                <span>${formatCurrency(item.subtotal)}</span>
              </div>
              ${item.notes ? `<div class="small" style="margin-left: 20px;">Note: ${item.notes}</div>` : ''}
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="row total">
            <span>TOTAL:</span>
            <span>${formatCurrency(receipt.total_price)}</span>
          </div>
          <div class="divider"></div>
          <div class="center small">Terima kasih atas kunjungan Anda!</div>
        </body>
        </html>
      `
      
      // Create hidden iframe for printing
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      
      const iframeDoc = iframe.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(printContent)
        iframeDoc.close()
        
        // Wait for content to load then print
        iframe.contentWindow?.focus()
        setTimeout(() => {
          iframe.contentWindow?.print()
          setTimeout(() => document.body.removeChild(iframe), 1000)
        }, 250)
      }
    } catch (err) {
      toast.error('Gagal mencetak struk: ' + getErrorMessage(err))
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

  // Base columns (tanpa aksi)
  const baseColumns = [
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
  ]

  // Columns dengan aksi untuk pesanan aktif
  const activeColumns = [...baseColumns, {
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
  }]

  // Pilih columns berdasarkan tab
  const columns = activeTab === 'active' ? activeColumns : baseColumns

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Kasir - Pesanan"
          description="Kelola pembayaran pesanan pelanggan"
        />

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Pesanan Aktif
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'paid'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Riwayat Pembayaran
          </button>
        </div>

        <DataTable
          key={activeTab}
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage={activeTab === 'active' ? 'Belum ada pesanan aktif' : 'Belum ada riwayat pembayaran'}
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

            {/* Payment Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Jumlah Uang Diterima
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Masukkan nominal pembayaran"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            {/* Change Calculation */}
            {paymentAmount && Number(paymentAmount) >= selectedOrder.total_price && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-900 dark:text-blue-300 font-semibold">Kembalian</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(Number(paymentAmount) - selectedOrder.total_price)}
                  </span>
                </div>
              </div>
            )}

            {/* Warning if insufficient */}
            {paymentAmount && Number(paymentAmount) < selectedOrder.total_price && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Uang tidak cukup. Kurang {formatCurrency(selectedOrder.total_price - Number(paymentAmount))}
                </p>
              </div>
            )}

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
                disabled={isProcessing || !paymentAmount || Number(paymentAmount) < selectedOrder.total_price}
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
