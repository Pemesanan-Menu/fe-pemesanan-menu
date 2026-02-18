import { ReactNode, useState, useMemo } from 'react'
import { UI } from '@/config/constants'
import { PaginationMeta } from '@/types'

interface Column<T> {
  header: string
  accessor: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  showNumber?: boolean
  // Server-side pagination
  meta?: PaginationMeta | null
  onPageChange?: (page: number) => void
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = 'Belum ada data',
  emptyIcon,
  onEdit,
  onDelete,
  searchable = true,
  searchPlaceholder = 'Cari...',
  searchKeys = [],
  showNumber = true,
  meta,
  onPageChange,
}: DataTableProps<T>): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Ensure data is always an array and memoize it
  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data])
  
  // Use server-side pagination if meta is provided
  const isServerSide = !!meta && !!onPageChange

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return safeData

    return safeData.filter((item) => {
      const searchLower = searchQuery.toLowerCase()
      
      // Search in specified keys
      if (searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const value = item[key]
          return String(value).toLowerCase().includes(searchLower)
        })
      }
      
      // Search in all string values
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      )
    })
  }, [safeData, searchQuery, searchable, searchKeys])

  // Paginate data
  const totalPages = isServerSide ? (meta?.total_pages || 1) : Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    if (isServerSide) {
      // Server-side: use data as-is
      return filteredData
    }
    // Client-side: slice data
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, isServerSide])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (isServerSide && onPageChange) {
      onPageChange(page)
    }
  }

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    handlePageChange(1)
  }

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    handlePageChange(validPage)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className={`w-full pl-10 pr-4 py-2 ${UI.BORDER.DEFAULT} ${UI.ROUNDED.DEFAULT} ${UI.BACKGROUND.PRIMARY} ${UI.TEXT_COLOR.PRIMARY} placeholder:text-gray-400 ${UI.BORDER.FOCUS}`}
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className={`px-3 py-2 ${UI.TEXT_COLOR.SECONDARY} hover:text-gray-700 dark:hover:text-gray-300 ${UI.FONT.SIZE.SM}`}
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className={`${UI.BACKGROUND.PRIMARY} ${UI.ROUNDED.DEFAULT} ${UI.SHADOW.DEFAULT} ${UI.BORDER.DEFAULT} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {showNumber && (
                  <th className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-3 lg:py-4 text-left ${UI.FONT.SIZE.XS} ${UI.FONT.WEIGHT.SEMIBOLD} text-gray-700 dark:text-gray-300 uppercase tracking-wider w-16`}>
                    No
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-3 lg:py-4 text-left ${UI.FONT.SIZE.XS} ${UI.FONT.WEIGHT.SEMIBOLD} text-gray-700 dark:text-gray-300 uppercase tracking-wider ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-3 lg:py-4 text-right ${UI.FONT.SIZE.XS} ${UI.FONT.WEIGHT.SEMIBOLD} text-gray-700 dark:text-gray-300 uppercase tracking-wider`}>
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${UI.BACKGROUND.PRIMARY}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0) + (showNumber ? 1 : 0)} className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-12 text-center`}>
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-3"></div>
                      <p className={`${UI.TEXT.BODY} ${UI.TEXT_COLOR.SECONDARY}`}>Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0) + (showNumber ? 1 : 0)} className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-12 text-center`}>
                    <div className="flex flex-col items-center justify-center">
                      {emptyIcon || (
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      )}
                      <p className={`${UI.TEXT.BODY} ${UI.FONT.WEIGHT.MEDIUM} ${UI.TEXT_COLOR.PRIMARY} mb-1`}>
                        {searchQuery ? 'Tidak ada hasil pencarian' : emptyMessage}
                      </p>
                      {searchQuery && (
                        <p className={`${UI.FONT.SIZE.SM} ${UI.TEXT_COLOR.SECONDARY}`}>
                          Coba kata kunci lain
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={item.id} className={`${UI.BACKGROUND.HOVER} ${UI.TRANSITION.DEFAULT}`}>
                    {showNumber && (
                      <td className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-3 lg:py-4 text-gray-500 dark:text-gray-400`}>
                        {isServerSide ? ((meta?.page || 1) - 1) * (meta?.limit || 10) + idx + 1 : (currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                    )}
                    {columns.map((col, idx) => (
                      <td key={idx} className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-3 lg:py-4`}>
                        {col.accessor(item)}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-3 lg:py-4`}>
                        <div className={`flex items-center justify-end gap-1 lg:gap-2`}>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className={`p-1.5 ${UI.COLORS.INFO.TEXT} hover:text-blue-900 dark:hover:text-blue-300 ${UI.COLORS.INFO.LIGHT} hover:bg-blue-50 dark:hover:bg-blue-900/20 ${UI.ROUNDED.DEFAULT} ${UI.TRANSITION.DEFAULT}`}
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className={`p-1.5 ${UI.COLORS.DANGER.TEXT} hover:text-red-900 dark:hover:text-red-300 ${UI.COLORS.DANGER.LIGHT} hover:bg-red-50 dark:hover:bg-red-900/20 ${UI.ROUNDED.DEFAULT} ${UI.TRANSITION.DEFAULT}`}
                              title="Hapus"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <p className={`${UI.FONT.SIZE.SM} ${UI.TEXT_COLOR.SECONDARY}`}>
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, isServerSide ? (meta?.total || 0) : filteredData.length)} dari {isServerSide ? (meta?.total || 0) : filteredData.length} data
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 ${UI.BORDER.DEFAULT} ${UI.ROUNDED.DEFAULT} ${UI.TEXT_COLOR.PRIMARY} disabled:opacity-50 disabled:cursor-not-allowed ${UI.BACKGROUND.HOVER} ${UI.TRANSITION.DEFAULT}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1.5 ${UI.ROUNDED.DEFAULT} ${UI.FONT.SIZE.SM} ${UI.TRANSITION.DEFAULT} ${
                      currentPage === pageNum
                        ? `${UI.COLORS.PRIMARY.DEFAULT} text-white`
                        : `${UI.BORDER.DEFAULT} ${UI.TEXT_COLOR.PRIMARY} ${UI.BACKGROUND.HOVER}`
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 ${UI.BORDER.DEFAULT} ${UI.ROUNDED.DEFAULT} ${UI.TEXT_COLOR.PRIMARY} disabled:opacity-50 disabled:cursor-not-allowed ${UI.BACKGROUND.HOVER} ${UI.TRANSITION.DEFAULT}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
