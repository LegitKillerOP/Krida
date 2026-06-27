import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Users, MapPin } from 'lucide-react'
import type { Event } from '@/types'
import { SPORTS } from '@/lib/constants'
import { Badge, Button } from '@/components/ui'
import { cn, formatPrice } from '@/lib/utils'

const SPORT_BY_SLUG = SPORTS.reduce<Record<string, (typeof SPORTS)[number]>>((acc, s) => {
  acc[s.slug] = s
  return acc
}, {})

function parseDate(dateString: string) {
  const parts = dateString.split('-')
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const d = new Date(year, month, day)
    return {
      day: d.toLocaleDateString('en-IN', { day: 'numeric' }),
      month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    }
  }
  
  const fallback = new Date(dateString)
  return {
    day: fallback.toLocaleDateString('en-IN', { day: 'numeric' }),
    month: fallback.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
  }
}

export function EventCard({
  event,
  variant = 'list',
}: {
  event: Event
  variant?: 'list' | 'detail'
}) {
  const sport = SPORT_BY_SLUG[event.sport]
  const { day, month } = parseDate(event.date)
  const isFull = event.status === 'full' || event.slots >= event.maxSlots
  const isCompleted = event.status === 'completed' || event.status === 'cancelled'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      whileHover={variant === 'list' ? { y: -4 } : undefined}
      className="group"
    >
      <Link to={`/events/${event.id}`} className={variant === 'detail' ? 'block pointer-events-none' : 'block'}>
        <div
          className={cn(
            'card flex gap-5 overflow-hidden p-5 transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]',
            variant === 'detail' && 'items-start',
          )}
        >
          {/* Calendar Date Frame */}
          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-ink text-surface">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{month}</span>
            <span className="font-heading text-3xl font-bold leading-none">{day}</span>
          </div>

          {/* Meta Content Area */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* FIXED: Using direct color variables via inline styles to cleanly override the parent <Link> inheritances, completely ignoring media-query issues */}
              <Badge 
                variant="outline" 
                style={{ color: 'var(--color-ink)' }}
                className="dark:text-surface"
              >
                {sport?.name ?? event.sport}
              </Badge>
              {isFull && <Badge variant="danger">Full</Badge>}
              {isCompleted && <Badge variant="default">Ended</Badge>}
            </div>

            <h3 className="font-heading text-lg font-semibold leading-tight text-ink">
              {event.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.venue}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {event.slots}/{event.maxSlots} slots
              </span>
            </div>

            {variant === 'detail' && (
              <p className="mt-1 line-clamp-2 text-sm text-muted">{event.description}</p>
            )}

            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-muted">by {event.host}</span>
              <div className="flex items-center gap-3">
                <span className="font-heading text-base font-semibold text-ink">
                  {event.fee === 0 ? 'Free' : formatPrice(event.fee)}
                </span>
                {variant === 'list' && !isFull && !isCompleted && (
                  <Button size="sm" variant="accent">
                    Join
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}