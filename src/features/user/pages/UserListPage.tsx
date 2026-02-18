import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { userService } from '../services/userService'
import { User } from '@/types'
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

export default function UserListPage() {
  const { users, meta, isLoading, refetch } = useUsers()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'cashier' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'cashier' })
    setShowModal(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, password: '', role: user.role })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingUser) {
        await userService.update(editingUser.id, { name: formData.name, email: formData.email, role: formData.role })
        toast.success('User berhasil diupdate')
      } else {
        await userService.create(formData)
        toast.success('User berhasil ditambahkan')
      }
      setShowModal(false)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    try {
      await userService.delete(userToDelete.id)
      toast.success('User berhasil dihapus')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setShowDeleteDialog(false)
      setUserToDelete(null)
    }
  }

  const columns = [
    {
      header: 'Pengguna',
      accessor: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          user.role === 'admin'
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            : user.role === 'cashier'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        }`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: () => <StatusBadge status={true} trueLabel="Aktif" falseLabel="Nonaktif" />,
    },
    {
      header: 'Terdaftar',
      accessor: (user: User) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(user.created_at).toLocaleDateString('id-ID', {
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
          title="Manajemen Pengguna"
          description="Kelola data pengguna dan hak akses sistem"
          action={{ label: '+ Tambah Pengguna', onClick: handleCreate }}
        />

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          emptyMessage="Belum ada pengguna"
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Cari nama atau email..."
          searchKeys={['name', 'email', 'role']}
          meta={meta}
          onPageChange={(page) => refetch(page)}
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Contoh: John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Contoh: john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          {!editingUser && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="kasir">Kasir</SelectItem>
                <SelectItem value="produksi">Produksi</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold text-gray-900 dark:text-white">{userToDelete?.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
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
