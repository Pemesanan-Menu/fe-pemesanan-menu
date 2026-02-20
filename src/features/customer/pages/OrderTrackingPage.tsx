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
    
    // Initial fetch
    fetchTracking()
    
    // Setup SSE connection for real-time updates
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    // Ensure base URL doesn't end with slash
    const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl
    const sseUrl = `${baseUrl}/sse/orders/${orderId}`
    
    let abortController = new AbortController()
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    let reconnectTimer: ReturnType<typeof setTimeout>
    
    const connectSSE = async () => {
      try {
        const response = await fetch(sseUrl, {
          headers: {
            'Accept': 'text/event-stream',
          },
          signal: abortController.signal,
        })

        if (!response.ok) {
          console.error('SSE Tracking connection failed:', response.status)
          scheduleReconnect()
          return
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) return

        reconnectAttempts = 0

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            scheduleReconnect()
            break
          }

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                JSON.parse(line.slice(6))
                fetchTracking()
              } catch (e) {
                // Ignore parse errors for heartbeat messages
              }
            }
          }
        }
      } catch (error: unknown) {
        if ((error as Error).name !== 'AbortError') {
          console.error('❌ SSE Tracking error:', error)
          scheduleReconnect()
        }
      }
    }

    const scheduleReconnect = () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.warn('⚠️ Max reconnection attempts reached, stopping SSE Tracking')
        return
      }
      
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
      reconnectAttempts++
      
      reconnectTimer = setTimeout(() => {
        abortController = new AbortController()
        connectSSE()
      }, delay)
    }

    connectSSE()

    return () => {
      clearTimeout(reconnectTimer)
      abortController.abort()
    }
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
        return <img src="/pay.gif" alt="Selesai" className={imgClass} />
      case 'DIBAYAR':
        return <img src="/pay.gif" alt="Dibayar" className={imgClass} />
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
      case 'SELESAI':
        return 'Pesanan Selesais, Silahkan Lakukan Pembayaran di Kasir.'
      case 'DIBAYAR':
        return 'Pesanan telah dibayar, Terima kasih!'
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
