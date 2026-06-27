import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-xl bg-ink/5 dark:bg-surface/10', className)} {...props} />
}

export { Skeleton }
