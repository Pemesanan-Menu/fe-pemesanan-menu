import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { customerService } from '../services/customerService'
import { Product, CartItem } from '@/types'
import { getErrorMessage } from '@/types/error'
import { Spinner } from '@/components/ui/spinner'
import { TableValidationForm } from '../components/TableValidationForm'
import { OrderHeader } from '../components/OrderHeader'
import { SearchFilter } from '../components/SearchFilter'
import { ProductGrid } from '../components/ProductGrid'
import { CartButton } from '../components/CartButton'
import { CartSidebar } from '../components/CartSidebar'

export default function OrderPage(): JSX.Element {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [tableNumber, setTableNumber] = useState('')
  const [tableId, setTableId] = useState('')
  const [isTableValidated, setIsTableValidated] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFromQR, setIsFromQR] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  
  const hasFetchedCategories = useRef(false)
  const hasValidatedTable = useRef(false)

  useEffect(() => {
    // Only fetch categories once using ref
    if (!hasFetchedCategories.current) {
      hasFetchedCategories.current = true
      fetchCategories()
    }
    
    // Auto-validate table from QR code URL parameter
    const tableParam = searchParams.get('table')
    if (tableParam && !hasValidatedTable.current) {
      hasValidatedTable.current = true
      setIsFromQR(true)
      setTableNumber(tableParam)
      validateTableFromParam(tableParam)
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
      // Remove duplicates case-insensitively
      const uniqueCategories: string[] = []
      const seenLower = new Set<string>()
      
      for (const category of data) {
        const lowerCategory = category.toLowerCase()
        if (!seenLower.has(lowerCategory)) {
          seenLower.add(lowerCategory)
          uniqueCategories.push(category)
        }
      }
      
      setCategories(['Semua', ...uniqueCategories])
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

  const validateTable = async (tableNumberInput: string): Promise<void> => {
    if (!tableNumberInput.trim()) {
      toast.error('Masukkan nomor meja')
      return
    }

    const number = parseInt(tableNumberInput)
    if (isNaN(number) || number <= 0) {
      toast.error('Nomor meja harus berupa angka positif')
      return
    }

    setIsValidating(true)
    try {
      const table = await customerService.validateTable(number)
      setTableId(table.id)
      setTableNumber(tableNumberInput)
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
    toast.success(`${product.name} ditambahkan ke keranjang`, {
      cancel: {
        label: '×',
        onClick: () => {}
      }
    })
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
    if (isFromQR) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )
    }
    return (
      <TableValidationForm
        onValidate={validateTable}
        isValidating={isValidating}
      />
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <OrderHeader tableNumber={tableNumber} onChangeTable={changeTable} canChangeTable={!isFromQR} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductGrid
          products={products}
          isLoading={isLoading}
          onAddToCart={addToCart}
        />
      </div>

      <CartButton
        totalItems={getTotalItems()}
        totalPrice={getTotalPrice()}
        onClick={() => setShowCart(true)}
      />

      <CartSidebar
        isOpen={showCart}
        cart={cart}
        isSubmitting={isSubmitting}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onUpdateNotes={updateNotes}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        getTotalItems={getTotalItems}
        getTotalPrice={getTotalPrice}
      />
    </div>
  )
}
