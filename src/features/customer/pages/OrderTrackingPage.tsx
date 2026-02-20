import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, XCircle } from 'lucide-react'
import { customerService } from '../services/customerService'
import { TrackingResponse } from '@/types'
import { getErrorMessage } from '@/types/error'
import { formatCurrency } from '@/utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export default function OrderTrackingPage(): JSX.Element {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [tracking, setTracking] = useState<TrackingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const previousStatusRef = useRef<string | null>(null)
  const imagesPreloadedRef = useRef(false)

  // Preload all GIF images once
  useEffect(() => {
    if (!imagesPreloadedRef.current) {
      const imagesToPreload = ['/wait.gif', '/cook.gif', '/pay.gif']
      imagesToPreload.forEach((src) => {
        const img = new Image()
        img.src = src
      })
      imagesPreloadedRef.current = true
    }
  }, [])

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
      
      // Check if status has actually changed
      const statusChanged = previousStatusRef.current !== null && 
                           previousStatusRef.current !== data.status

      if (statusChanged) {
        // Trigger smooth transition only on status change
        setIsTransitioning(true)
        
        // Fade out
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Update tracking data
        setTracking(data)
        previousStatusRef.current = data.status
        
        // Fade in
        await new Promise(resolve => setTimeout(resolve, 50))
        setIsTransitioning(false)
      } else {
        // No status change, just update data silently
        setTracking(data)
        if (previousStatusRef.current === null) {
          previousStatusRef.current = data.status
        }
      }
      
      setIsLoading(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
      setIsLoading(false)
    }
  }


  const getStatusIcon = (status: string): JSX.Element => {
    const imgClass = `w-32 h-32 mx-auto transition-all duration-500 ease-out ${
      isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
    }`
    
    switch (status) {
      case 'MENUNGGU':
        return <img src="/wait.gif" alt="Menunggu" className={imgClass} />
      case 'DIPROSES':
        return <img src="/cook.gif" alt="Diproses" className={imgClass} />
      case 'SELESAI':
      case 'SIAP':
        return <img src="/pay.gif" alt="Selesai" className={imgClass} />
      case 'DIBATALKAN':
        return <XCircle className={`w-12 h-12 text-red-600 mx-auto transition-all duration-500 ease-out ${
          isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`} />
      default:
        return <img src="/wait.gif" alt="Menunggu" className={imgClass} />
    }
  }

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'MENUNGGU':
        return 'Pesanan Anda Sedang Dalam Antrian'
      case 'DIPROSES':
        return 'Pesanan Anda Sedang Dimasak, Harap Tunggu'
      case 'SIAP':
        return 'Pesanan siap, Silahkan Lakukan Pembayaran di Kasir'
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
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="relative">
              {getStatusIcon(tracking?.status || 'MENUNGGU')}
            </div>
            <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2 transition-all duration-500 ease-out ${
              isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
              {getStatusMessage(tracking?.status || 'MENUNGGU')}
            </h2>
            {tracking?.status === 'DIPROSES' && tracking?.remaining_minutes && tracking.remaining_minutes > 0 && (
              <p className={`text-sm text-gray-600 dark:text-gray-400 mt-2 transition-all duration-500 ease-out ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                Siap dalam ~{tracking.remaining_minutes} menit
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
                <span className="text-gray-600 dark:text-gray-400">Waktu Pesan:</span>
                <span className="text-gray-900 dark:text-white">
                  {tracking?.created_at ? new Date(tracking.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '-'}
                </span>
              </div>
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
              {tracking?.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.quantity}x {formatCurrency(item.subtotal / item.quantity)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              )) || <p className="text-gray-500">Tidak ada item</p>}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {formatCurrency(tracking?.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
