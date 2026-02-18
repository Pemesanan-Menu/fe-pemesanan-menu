import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format'

interface CartButtonProps {
  totalItems: number
  totalPrice: number
  onClick: () => void
}

export function CartButton({ totalItems, totalPrice, onClick }: CartButtonProps): JSX.Element | null {
  if (totalItems === 0) {
    return null
  }

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
      size="lg"
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {totalItems} Item - {formatCurrency(totalPrice)}
    </Button>
  )
}
