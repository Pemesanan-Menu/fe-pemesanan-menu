import { Plus } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps): JSX.Element {
  return (
    <Card className={`hover:shadow-md transition-shadow ${!product.is_available ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-1">
              {product.name}
            </h3>
            <Badge variant="secondary" className="text-xs mb-2">
              {product.category}
            </Badge>
          </div>
          {!product.is_available && (
            <Badge variant="destructive" className="text-xs whitespace-nowrap">
              Habis
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(product.price)}
          </span>
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.is_available}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
