import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; to?: string; onClick?: () => void }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-2xl bg-ink/5 p-4 dark:bg-surface/10">
        <Icon className="h-8 w-8 text-muted" />
      </div>
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && action.to ? (
        <Button asChild className="mt-6">
          <Link to={action.to}>{action.label}</Link>
        </Button>
      ) : (
        action && (
          <Button className="mt-6" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
