import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { customerService } from '../services/customerService'
import { TrackingResponse } from '@/types'
import { getErrorMessage } from '@/types/error'
import { formatCurrency } from '@/utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

export default function OrderTrackingPage(): JSX.Element {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [tracking, setTracking] = useState<TrackingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      navigate('/customer/order')
      return
    }
    fetchTracking()
    const interval = setInterval(fetchTracking, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const fetchTracking = async (): Promise<void> => {
    if (!orderId) return
    try {
      const data = await customerService.trackOrder(orderId)
      setTracking(data)
      setIsLoading(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string): JSX.Element => {
    const variants: Record<string, string> = {
      'MENUNGGU': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'DIPROSES': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'SIAP': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'SELESAI': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'DIBATALKAN': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${variants[status] || variants['MENUNGGU']}`}>
        {status}
      </span>
    )
  }

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'SELESAI':
        return <CheckCircle2 className="w-12 h-12 text-green-600" />
      case 'DIBATALKAN':
        return <XCircle className="w-12 h-12 text-red-600" />
      default:
        return <Clock className="w-12 h-12 text-blue-600 animate-pulse" />
    }
  }

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'MENUNGGU':
        return 'Menunggu konfirmasi kasir'
      case 'DIPROSES':
        return 'Sedang diproses di dapur'
      case 'SIAP':
        return 'Pesanan siap disajikan'
      case 'SELESAI':
        return 'Pesanan telah selesai'
      case 'DIBATALKAN':
        return 'Pesanan dibatalkan'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Pesanan Tidak Ditemukan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pesanan dengan ID tersebut tidak ditemukan
            </p>
            <Button onClick={() => navigate('/customer/order')}>
              Pesan Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/customer/order')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Pesan Lagi
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Status Pesanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ID Pesanan: {tracking.order.order_number}
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            {getStatusIcon(tracking.order.status)}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
              {getStatusMessage(tracking.order.status)}
            </h2>
            {getStatusBadge(tracking.order.status)}
            {tracking.estimated_time && (
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Estimasi waktu: <strong>{tracking.estimated_time}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Nomor Meja:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {tracking.order.table?.number || '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Waktu Pesan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(tracking.order.created_at).toLocaleString('id-ID')}
                </span>
              </div>
              {tracking.order.payment_status && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status Pembayaran:</span>
                  <Badge variant={tracking.order.payment_status === 'PAID' ? 'default' : 'secondary'}>
                    {tracking.order.payment_status === 'PAID' ? 'Lunas' : 'Belum Bayar'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Item Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tracking.order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.quantity}x {formatCurrency(item.price)}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                        Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(tracking.order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-refresh Notice */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Status akan diperbarui otomatis setiap 10 detik
        </p>
      </div>
    </div>
  )
}
