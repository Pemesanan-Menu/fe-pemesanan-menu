import { X } from 'lucide-react'
import { CartItem as CartItemType } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { CartItem } from './CartItem'

interface CartSidebarProps {
  isOpen: boolean
  cart: CartItemType[]
  isSubmitting: boolean
  onClose: () => void
  onUpdateQuantity: (productId: string, delta: number) => void
  onUpdateNotes: (productId: string, notes: string) => void
  onRemove: (productId: string) => void
  onCheckout: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export function CartSidebar({
  isOpen,
  cart,
  isSubmitting,
  onClose,
  onUpdateQuantity,
  onUpdateNotes,
  onRemove,
  onCheckout,
  getTotalItems,
  getTotalPrice
}: CartSidebarProps): JSX.Element | null {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div 
        className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Keranjang</h2>
            <p className="text-sm text-gray-500">{getTotalItems()} item</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Keranjang kosong</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onUpdateNotes={onUpdateNotes}
                    onRemove={onRemove}
                  />
                ))}
              </div>

              {/* Total */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal ({getTotalItems()} item)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(getTotalPrice())}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-lg font-bold">
                          {formatCurrency(getTotalPrice())}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={onCheckout}
                disabled={isSubmitting}
                className="w-full"
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
  )
}
