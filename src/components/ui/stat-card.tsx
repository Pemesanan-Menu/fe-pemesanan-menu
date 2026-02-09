import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className="border-0 shadow-md dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`${color} p-3 rounded-lg text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
