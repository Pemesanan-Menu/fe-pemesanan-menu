import { ReactNode } from 'react'
import { UI } from '@/config/constants'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps): JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${UI.BACKGROUND.PRIMARY} ${UI.ROUNDED.LG} ${UI.SHADOW['2XL']} w-full max-w-md max-h-[90vh] overflow-y-auto ${UI.BORDER.DEFAULT} animate-in fade-in zoom-in duration-200`}>
        <div className={`flex items-center justify-between ${UI.SPACING.RESPONSIVE.PADDING} border-b ${UI.BORDER.DEFAULT.split(' ')[1]} sticky top-0 ${UI.BACKGROUND.PRIMARY} z-10`}>
          <h2 className={`${UI.TEXT.SUBHEADING} ${UI.FONT.WEIGHT.BOLD} ${UI.TEXT_COLOR.PRIMARY}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`${UI.TEXT_COLOR.SECONDARY} hover:text-gray-600 dark:hover:text-gray-300 ${UI.TRANSITION.DEFAULT}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={UI.SPACING.RESPONSIVE.PADDING}>{children}</div>
      </div>
    </div>
  )
}
