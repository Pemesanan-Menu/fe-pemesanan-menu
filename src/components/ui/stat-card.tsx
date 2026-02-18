import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string
}

export function StatCard({ title, value, icon, color }: StatCardProps): JSX.Element {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
          </div>
          <div className={`${color} p-3.5 rounded-xl text-white shrink-0 [&>svg]:w-6 [&>svg]:h-6`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
