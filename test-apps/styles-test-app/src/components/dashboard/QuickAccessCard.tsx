import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@unifirst/ui'

interface QuickAccessCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  count?: number
}

export default function QuickAccessCard({
  title,
  description,
  href,
  icon: Icon,
  count,
}: QuickAccessCardProps) {
  return (
    <Link
      to={href}
      className="block bg-white rounded-lg border border-unifirst-gray-light p-6 hover:border-unifirst-green hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
            'bg-unifirst-green-lightest text-unifirst-green',
            'group-hover:bg-unifirst-green group-hover:text-white'
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {count !== undefined && (
          <span className="text-2xl font-bold text-unifirst-gray-dark font-mono">
            {count}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-unifirst-gray-dark mb-1 group-hover:text-unifirst-green transition-colors">
        {title}
      </h3>
      <p className="text-sm text-unifirst-gray-slate">{description}</p>
    </Link>
  )
}
