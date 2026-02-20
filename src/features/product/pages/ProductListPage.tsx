import { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { productService } from '../services/productService'
import { Product } from '@/types'
import { getErrorMessage } from '@/types/error'
import { toast } from 'sonner'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/modal'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { formatCurrency, formatInputNumber, parseFormattedNumber } from '@/utils/format'

export default function ProductListPage(): JSX.Element {
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const { products, meta, isLoading, refetch } = useProducts(categoryFilter)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'Makanan', stock: 1, is_available: true })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`)
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to default categories
        setCategories(['Makanan', 'Minuman', 'Snack', 'Dessert'])
      }
    }
    fetchCategories()
  }, [])

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: '', category: 'Makanan', stock: 1, is_available: true })
    setShowModal(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: formatInputNumber(product.price.toString()),
      category: product.category,
      stock: product.stock,
      is_available: product.is_available,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const priceValue = parseFormattedNumber(formData.price)
      if (editingProduct) {
        await productService.update(editingProduct.id, { ...formData, price: priceValue })
        toast.success('Produk berhasil diupdate')
      } else {
        await productService.create({ ...formData, price: priceValue })
        toast.success('Produk berhasil ditambahkan')
      }
      setShowModal(false)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    try {
      await productService.delete(productToDelete.id)
      toast.success('Produk berhasil dihapus')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setShowDeleteDialog(false)
      setProductToDelete(null)
    }
  }

  const columns = [
    {
      header: 'Produk',
      accessor: (product: Product) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</div>
        </div>
      ),
    },
    {
      header: 'Kategori',
      accessor: (product: Product) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {product.category}
        </span>
      ),
    },
    {
      header: 'Harga',
      accessor: (product: Product) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (product: Product) => <StatusBadge status={product.is_available} trueLabel="Tersedia" falseLabel="Habis" />,
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Manajemen Produk"
          description="Kelola produk/menu yang tersedia"
          action={{ label: '+ Tambah Produk', onClick: handleCreate }}
        />

        {/* Search & Filter */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari nama produk..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={() => {
                // Implement search if needed
              }}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori:</label>
            <Select value={categoryFilter || 'all'} onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          key={categoryFilter}
          columns={columns}
          data={products}
          isLoading={isLoading}
          emptyMessage="Belum ada produk"
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={false}
          meta={meta}
          onPageChange={(page) => refetch(page)}
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Produk' : 'Tambah Produk'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk</Label>
            <Input 
              id="name" 
              placeholder="Contoh: Nasi Goreng Spesial" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea 
              id="description" 
              placeholder="Contoh: Nasi goreng dengan telur, ayam, dan sayuran segar" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              rows={3} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input 
              id="price" 
              placeholder="Contoh: 25.000" 
              value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: formatInputNumber(e.target.value) })} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Makanan">Makanan</SelectItem>
                <SelectItem value="Minuman">Minuman</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stok</Label>
            <Input 
              id="stock" 
              type="number"
              placeholder="Contoh: 50" 
              value={formData.stock || ''} 
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 1 })} 
              min="1"
              required 
            />
          </div>
          {editingProduct && (
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="available" 
                checked={formData.is_available} 
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })} 
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500" 
              />
              <Label htmlFor="available" className="cursor-pointer">Tersedia untuk dijual</Label>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              onClick={() => setShowModal(false)} 
              variant="outline"
              className="flex-1"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Modal>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-gray-900 dark:text-white">{productToDelete?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
