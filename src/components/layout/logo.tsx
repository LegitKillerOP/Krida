import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        'group inline-flex items-center gap-1 font-heading font-bold uppercase tracking-[0.25em] text-xl text-ink dark:text-surface',
        className,
      )}
    >
      <span>krida</span>
      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
    </Link>
  )
}
