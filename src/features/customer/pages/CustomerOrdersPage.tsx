import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingBag } from 'lucide-react'
import { TrackingResponse } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export default function CustomerOrdersPage(): JSX.Element {
  const navigate = useNavigate()
  const [orders] = useState<TrackingResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // This page is currently not used since we don't have a way to list all orders for a customer
    // Each order has its own tracking page accessible via QR code or URL
    setIsLoading(false)
  }, [])

  const handleViewOrder = (orderId: string): void => {
    navigate(`/customer/tracking/${orderId}`)
  }

  const getStatusBadge = (status: string): JSX.Element => {
    const variants: Record<string, string> = {
      'MENUNGGU': 'bg-yellow-100 text-yellow-800',
      'DIPROSES': 'bg-blue-100 text-blue-800',
      'SELESAI': 'bg-green-100 text-green-800',
      'DIBAYAR': 'bg-purple-100 text-purple-800',
      'DIBATALKAN': 'bg-red-100 text-red-800',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[status] || variants['MENUNGGU']}`}>
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Riwayat Pesanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lacak pesanan Anda menggunakan QR code atau link yang diberikan saat checkout
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Belum Ada Pesanan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Untuk melacak pesanan, gunakan link tracking yang diberikan setelah checkout
              </p>
              <Button onClick={() => navigate('/customer/order')}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Mulai Pesan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((tracking) => (
              <Card key={tracking.order_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Pesanan
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(tracking.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(tracking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Item:</span>
                      <span className="font-semibold">
                        {tracking.items.length} item
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total:</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(tracking.items.reduce((sum, item) => sum + item.subtotal, 0))}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleViewOrder(tracking.order_id)}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
