import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ShoppingCart, Plus, Minus, X, ShoppingBag } from 'lucide-react'
import { customerService } from '../services/customerService'
import { Product, CartItem } from '@/types'
import { getErrorMessage } from '@/types/error'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function OrderPage(): JSX.Element {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(['Semua'])
  const [tableNumber, setTableNumber] = useState('')
  const [tableId, setTableId] = useState('')
  const [isTableValidated, setIsTableValidated] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  useEffect(() => {
    fetchCategories()
    
    // Auto-validate table from QR code URL parameter
    const tableParam = searchParams.get('table')
    if (tableParam) {
      setTableNumber(tableParam)
      // Auto-validate after a brief delay to show the UI
      setTimeout(() => {
        validateTableFromParam(tableParam)
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isTableValidated) {
      fetchProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTableValidated, searchQuery, selectedCategory])

  const fetchCategories = async (): Promise<void> => {
    try {
      const data = await customerService.getCategories()
      setCategories(['Semua', ...data])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const data = await customerService.getMenu(1, 100, searchQuery, selectedCategory)
      setProducts(data.items)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const validateTableFromParam = async (tableParam: string): Promise<void> => {
    const number = parseInt(tableParam)
    if (isNaN(number) || number <= 0) {
      return
    }

    setIsValidating(true)
    try {
      const table = await customerService.validateTable(number)
      setTableId(table.id)
      setIsTableValidated(true)
      toast.success(`Selamat datang di Meja ${table.number}!`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsValidating(false)
    }
  }

  const validateTable = async (): Promise<void> => {
    if (!tableNumber.trim()) {
      toast.error('Masukkan nomor meja')
      return
    }

    const number = parseInt(tableNumber)
    if (isNaN(number) || number <= 0) {
      toast.error('Nomor meja harus berupa angka positif')
      return
    }

    setIsValidating(true)
    try {
      const table = await customerService.validateTable(number)
      setTableId(table.id)
      setIsTableValidated(true)
      toast.success(`Meja ${table.number} berhasil divalidasi!`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsValidating(false)
    }
  }

  const changeTable = (): void => {
    setIsTableValidated(false)
    setTableNumber('')
    setTableId('')
    setCart([])
  }

  const addToCart = (product: Product): void => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1, notes: '' }]
    })
    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  const updateQuantity = (productId: string, delta: number): void => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const updateNotes = (productId: string, notes: string): void => {
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, notes } : item
    ))
  }

  const removeFromCart = (productId: string): void => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async (): Promise<void> => {
    if (!tableId) {
      toast.error('Validasi meja terlebih dahulu')
      return
    }
    if (cart.length === 0) {
      toast.error('Keranjang masih kosong')
      return
    }

    setIsSubmitting(true)
    try {
      const order = await customerService.createOrder({
        table_id: tableId,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          notes: item.notes || undefined
        }))
      })
      toast.success('Pesanan berhasil! Silakan tunggu konfirmasi')
      setCart([])
      setShowCart(false)
      // Navigate to tracking page with order ID
      navigate(`/customer/tracking/${order.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isTableValidated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <ShoppingBag className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Selamat Datang
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isValidating 
                  ? 'Memvalidasi nomor meja...'
                  : 'Masukkan nomor meja Anda untuk mulai memesan'
                }
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="tableNumber">Nomor Meja</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  placeholder="Contoh: 5"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && validateTable()}
                  className="mt-1"
                  min="1"
                />
              </div>
              
              <Button
                onClick={validateTable}
                disabled={isValidating || !tableNumber.trim()}
                className="w-full"
                size="lg"
              >
                {isValidating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Memvalidasi...
                  </>
                ) : (
                  'Lanjutkan'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table Selection */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nomor Meja</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Meja {tableNumber}</p>
              </div>
              <Button variant="outline" onClick={changeTable} size="sm">
                Ganti Meja
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {product.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(product.price)}
                  </span>
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={!product.is_available}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Tidak ada menu yang ditemukan
            </p>
          </div>
        )}
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setShowCart(true)}
            size="lg"
            className="rounded-full shadow-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Keranjang ({getTotalItems()})
            <Badge variant="secondary" className="ml-2">
              {formatCurrency(getTotalPrice())}
            </Badge>
          </Button>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-end">
          <div className="bg-white dark:bg-gray-800 w-full sm:w-96 h-full sm:h-screen sm:max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Keranjang ({getTotalItems()} item)
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-12">
                  Keranjang masih kosong
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <Card key={item.product.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {formatCurrency(item.product.price)}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="ml-auto"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Catatan (opsional)"
                                value={item.notes || ''}
                                onChange={(e) => updateNotes(item.product.id, e.target.value)}
                                className="mt-2 text-sm"
                                rows={2}
                              />
                            </div>
                          </div>
                          <div className="mt-2 text-right">
                            <span className="font-bold text-blue-600">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold">{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">{formatCurrency(getTotalPrice())}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isSubmitting || !tableId}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Memproses...
                      </>
                    ) : (
                      'Checkout'
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
