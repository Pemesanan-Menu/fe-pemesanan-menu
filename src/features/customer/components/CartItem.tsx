import { Plus, Minus, X } from 'lucide-react'
import { CartItem as CartItemType } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, delta: number) => void
  onUpdateNotes: (productId: string, notes: string) => void
  onRemove: (productId: string) => void
}

export function CartItem({ item, onUpdateQuantity, onUpdateNotes, onRemove }: CartItemProps): JSX.Element {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-sm line-clamp-1 flex-1 pr-2">
            {item.product.name}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(item.product.id)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {formatCurrency(item.product.price)}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(item.product.id, -1)}
            className="h-7 w-7 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(item.product.id, 1)}
            className="h-7 w-7 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        <Textarea
          placeholder="Catatan (opsional)"
          value={item.notes || ''}
          onChange={(e) => onUpdateNotes(item.product.id, e.target.value)}
          className="text-xs mb-2"
          rows={2}
        />
        
        <div className="pt-2 border-t text-right">
          <span className="text-xs text-gray-500 mr-1">Subtotal:</span>
          <span className="font-semibold">
            {formatCurrency(item.product.price * item.quantity)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
