import { ReactNode } from 'react'
import { UI } from '@/config/constants'

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
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = 'Belum ada data',
  emptyIcon,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className={`${UI.BACKGROUND.PRIMARY} ${UI.ROUNDED.DEFAULT} ${UI.SHADOW.DEFAULT} ${UI.BORDER.DEFAULT} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
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
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-12 text-center`}>
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-3"></div>
                    <p className={`${UI.TEXT.BODY} ${UI.TEXT_COLOR.SECONDARY}`}>Memuat data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className={`${UI.SPACING.RESPONSIVE.PADDING_X} py-12 text-center`}>
                  <div className="flex flex-col items-center justify-center">
                    {emptyIcon || (
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    )}
                    <p className={`${UI.TEXT.BODY} ${UI.FONT.WEIGHT.MEDIUM} ${UI.TEXT_COLOR.PRIMARY} mb-1`}>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className={`${UI.BACKGROUND.HOVER} ${UI.TRANSITION.DEFAULT}`}>
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
  )
}
