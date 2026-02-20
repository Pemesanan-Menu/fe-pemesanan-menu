import { Button } from '@/components/ui/button'

interface OrderHeaderProps {
  tableNumber: string
  onChangeTable: () => void
}

export function OrderHeader({ tableNumber, onChangeTable }: OrderHeaderProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-900 border-b sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/img/logo.webp" 
              alt="UMKM Kuliner Logo" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Caffe Tetangga</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Meja {tableNumber}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onChangeTable} size="sm">
            Ganti Meja
          </Button>
        </div>
      </div>
    </div>
  )
}
