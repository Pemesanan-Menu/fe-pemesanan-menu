import { Plus } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps): JSX.Element {
  const stock = product.stock || 0
  const isOutOfStock = !product.is_available || stock === 0
  const isLowStock = stock > 0 && stock <= 5
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${isOutOfStock ? 'opacity-60' : ''}`}>
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
          {isOutOfStock && (
            <Badge className="text-xs whitespace-nowrap bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              Habis
            </Badge>
          )}
          {!isOutOfStock && isLowStock && (
            <Badge className="text-xs whitespace-nowrap bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              Stok: {stock}
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
            disabled={isOutOfStock}
            size="sm"
            title={isOutOfStock ? 'Produk habis' : 'Tambah ke keranjang'}
          >
            <Plus className="w-4 h-4" />
            Tambah
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
