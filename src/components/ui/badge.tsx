import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-ink text-surface dark:bg-surface dark:text-ink',
        outline: 'border-ink/15 text-ink dark:border-surface/20 dark:text-surface',
        success: 'border-transparent bg-accent/15 text-ink', 
        warning: 'border-transparent bg-amber-100 text-amber-900',
        danger: 'border-transparent bg-red-100 text-red-900',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
