import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MENU_GROUPS, ICONS } from '@/config/menu'
import { APP_CONFIG, UI } from '@/config/constants'
import { authUtils } from '@/utils/auth'
import { formatDate } from '@/utils/date'
import { useTheme } from '@/hooks/useTheme'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { theme, toggleTheme } = useTheme()
  
  const user = authUtils.getUser()

  // Close sidebar on mobile by default, only on initial load
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [])

  const filteredMenuGroups = MENU_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const hasAccess = authUtils.hasRole(item.roles)
      console.log(`Menu: ${item.name}, Roles: ${item.roles}, User Role: ${user?.role}, Has Access: ${hasAccess}`)
      return hasAccess
    })
  })).filter(group => group.items.length > 0)

  const handleLogout = () => {
    authUtils.logout()
    toast.success('Logout berhasil', {
      description: 'Sampai jumpa lagi!'
    })
    navigate('/')
  }

  return (
    <div className={`min-h-screen ${UI.BACKGROUND.SECONDARY}`}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${UI.BACKGROUND.PRIMARY} border-r ${UI.BORDER.DEFAULT.split(' ')[1]} ${UI.SIDEBAR.WIDTH}`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center justify-between px-6 border-b ${UI.BORDER.DEFAULT.split(' ')[1]}`}>
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt={APP_CONFIG.name} className="w-8 h-8 object-contain" />
            <span className={`${UI.FONT.WEIGHT.BOLD} ${UI.TEXT_COLOR.PRIMARY}`}>{APP_CONFIG.name}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {filteredMenuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group.label}
                </span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 ${UI.ROUNDED.DEFAULT} ${UI.TRANSITION.DEFAULT} ${
                        isActive
                          ? `${UI.BACKGROUND.ACTIVE} ${UI.COLORS.PRIMARY.TEXT} ${UI.FONT.WEIGHT.MEDIUM}`
                          : `text-gray-700 dark:text-gray-300 ${UI.BACKGROUND.HOVER}`
                      }`}
                    >
                      {ICONS[item.icon]}
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${UI.BORDER.DEFAULT.split(' ')[1]} ${UI.BACKGROUND.PRIMARY}`}>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer active:scale-95">
                <div className={`w-10 h-10 ${UI.COLORS.PRIMARY.GRADIENT} ${UI.ROUNDED.FULL} flex items-center justify-center text-white ${UI.FONT.WEIGHT.SEMIBOLD} shadow-md`}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className={`${UI.FONT.SIZE.SM} ${UI.FONT.WEIGHT.MEDIUM} ${UI.TEXT_COLOR.PRIMARY} truncate`}>{user?.name}</p>
                  <p className={`${UI.FONT.SIZE.XS} ${UI.TEXT_COLOR.SECONDARY}`}>{user?.role}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end" side="top">
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all active:scale-95"
              >
                {ICONS.logout}
                <span className="font-medium">Keluar</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari aplikasi? Anda harus login kembali untuk mengakses sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <div className={`transition-all ${isSidebarOpen ? UI.SIDEBAR.MARGIN : 'ml-0'}`}>
        {/* Header */}
        <header className={`h-16 ${UI.BACKGROUND.PRIMARY} border-b ${UI.BORDER.DEFAULT.split(' ')[1]} flex items-center justify-between ${UI.SPACING.RESPONSIVE.PADDING_X}`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 ${UI.ROUNDED.DEFAULT} ${UI.BACKGROUND.HOVER} ${UI.TRANSITION.DEFAULT}`}
          >
            {ICONS.menu}
          </button>

          <div className={`flex items-center ${UI.SPACING.RESPONSIVE.GAP}`}>
            <span className={`${UI.TEXT.BODY} ${UI.TEXT_COLOR.SECONDARY} hidden sm:block`}>
              {formatDate(new Date())}
            </span>
            
            <button
              onClick={toggleTheme}
              className={`p-2 ${UI.ROUNDED.DEFAULT} ${UI.BACKGROUND.HOVER} ${UI.TRANSITION.DEFAULT}`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={UI.SPACING.RESPONSIVE.PADDING}>
          {children}
        </main>
      </div>
    </div>
  )
}
