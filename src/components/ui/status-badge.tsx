interface StatusBadgeProps {
  status: boolean
  trueLabel?: string
  falseLabel?: string
  showDot?: boolean
}

export function StatusBadge({ status, trueLabel = 'Aktif', falseLabel = 'Nonaktif', showDot = true }: StatusBadgeProps): JSX.Element {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        status
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      }`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status ? 'bg-green-500' : 'bg-red-500'}`}></span>}
      {status ? trueLabel : falseLabel}
    </span>
  )
}
