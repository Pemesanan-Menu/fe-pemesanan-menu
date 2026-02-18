import { useState } from 'react'
import { useTables } from '../hooks/useTables'
import { tableService } from '../services/tableService'
import { Table } from '@/types'
import { getErrorMessage } from '@/types/error'
import { toast } from 'sonner'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Modal } from '@/components/ui/modal'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function TableListPage() {
  const { tables, meta, isLoading, refetch } = useTables()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null)
  const [formData, setFormData] = useState({ number: '', is_active: true })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [downloadingQRId, setDownloadingQRId] = useState<string | null>(null)

  const handleCreate = () => {
    setEditingTable(null)
    setFormData({ number: '', is_active: true })
    setShowModal(true)
  }

  const handleEdit = (table: Table) => {
    setEditingTable(table)
    setFormData({ number: table.number.toString(), is_active: table.is_active })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const numberValue = parseInt(formData.number)
      if (editingTable) {
        await tableService.update(editingTable.id, { number: numberValue, is_active: formData.is_active })
        toast.success('Meja berhasil diupdate')
      } else {
        await tableService.create({ number: numberValue })
        toast.success('Meja berhasil ditambahkan')
      }
      setShowModal(false)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (table: Table) => {
    setTableToDelete(table)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!tableToDelete) return
    try {
      await tableService.delete(tableToDelete.id)
      toast.success('Meja berhasil dihapus')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setShowDeleteDialog(false)
      setTableToDelete(null)
    }
  }

  const handleDownloadQR = async (table: Table) => {
    setDownloadingQRId(table.id)
    try {
      await tableService.downloadQRCode(table.id, table.number)
      toast.success(`QR Code Meja ${table.number} berhasil diunduh`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDownloadingQRId(null)
    }
  }

  const columns = [
    {
      header: 'Nomor Meja',
      accessor: (table: Table) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            {table.number}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">Meja {table.number}</span>
        </div>
      ),
    },
    {
      header: 'QR Code',
      accessor: (table: Table) => {
        const isDownloading = downloadingQRId === table.id
        return (
          <button
            onClick={() => handleDownloadQR(table)}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </>
            )}
          </button>
        )
      },
    },
    {
      header: 'Status',
      accessor: (table: Table) => <StatusBadge status={table.is_active} trueLabel="Aktif" falseLabel="Nonaktif" />,
    },
    {
      header: 'Dibuat',
      accessor: (table: Table) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(table.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Manajemen Meja"
          description="Kelola meja dan QR Code untuk pemesanan"
          action={{ label: '+ Tambah Meja', onClick: handleCreate }}
        />

        <DataTable
          columns={columns}
          data={tables}
          isLoading={isLoading}
          emptyMessage="Belum ada meja"
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Cari nomor meja..."
          searchKeys={['number']}
          meta={meta}
          onPageChange={(page) => refetch(page)}
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTable ? 'Edit Meja' : 'Tambah Meja'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Nomor Meja</Label>
            <Input
              id="number"
              type="number"
              placeholder="Contoh: 1"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
          </div>
          {editingTable && (
            <div className="space-y-2">
              <Label htmlFor="status">Status Meja</Label>
              <Select
                value={formData.is_active ? 'true' : 'false'}
                onValueChange={(value) => setFormData({ ...formData, is_active: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Meja</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-900 dark:text-white">Meja {tableToDelete?.number}</span>?
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

