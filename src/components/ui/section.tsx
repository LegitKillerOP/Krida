import * as React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('px-6 py-20 sm:px-8 lg:px-12', className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
      )}
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base text-muted sm:text-lg">{description}</p>}
    </div>
  )
}
