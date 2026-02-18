import { UI } from '@/config/constants'

interface PageHeaderProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function PageHeader({ title, description, action }: PageHeaderProps): JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className={`${UI.TEXT.HEADING} ${UI.FONT.WEIGHT.BOLD} ${UI.TEXT_COLOR.PRIMARY}`}>{title}</h1>
        <p className={`mt-1 ${UI.TEXT.BODY} ${UI.TEXT_COLOR.SECONDARY}`}>{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className={`px-4 py-2 ${UI.COLORS.PRIMARY.DEFAULT} text-white ${UI.ROUNDED.DEFAULT} ${UI.FONT.WEIGHT.MEDIUM} ${UI.TRANSITION.DEFAULT} whitespace-nowrap self-start sm:self-auto`}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
