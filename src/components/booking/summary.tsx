import { cn, formatPrice } from '@/lib/utils'
import { MapPin, Calendar, Clock, Users, Receipt } from 'lucide-react'

interface SummaryProps {
  venueName: string
  sport: string
  date: string
  time: string
  hours: number
  players: number
  pricePerHour: number
}

const CONVENIENCE_FEE = 49

export function Summary({
  venueName,
  sport,
  date,
  time,
  hours,
  players,
  pricePerHour,
}: SummaryProps) {
  const total = pricePerHour * hours
  const grandTotal = total + CONVENIENCE_FEE

  return (
    <div
      className={cn(
        'sticky top-24 space-y-6 rounded-2xl border border-ink/10 bg-white p-6 dark:border-surface/10 dark:bg-ink/5',
      )}
    >
      <div className="flex items-center gap-2">
        <Receipt className="h-5 w-5 text-ink dark:text-surface" />
        <h3 className="font-heading text-lg font-semibold">Booking Summary</h3>
      </div>

      <div className="space-y-4 border-b border-ink/10 pb-6 dark:border-surface/10">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <p className="text-xs text-muted">Venue</p>
            <p className="text-sm font-medium">{venueName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <p className="text-xs text-muted">Sport</p>
            <p className="text-sm font-medium capitalize">{sport}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <p className="text-xs text-muted">Date & Time</p>
            <p className="text-sm font-medium">
              {date} at {time}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <p className="text-xs text-muted">Duration</p>
            <p className="text-sm font-medium">{hours} hour{hours > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <p className="text-xs text-muted">Players</p>
            <p className="text-sm font-medium">{players} player{players > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {formatPrice(pricePerHour)} x {hours} hr{hours > 1 ? 's' : ''}
          </span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Convenience fee</span>
          <span className="font-medium">{formatPrice(CONVENIENCE_FEE)}</span>
        </div>

        <div className="border-t border-ink/10 pt-3 dark:border-surface/10">
          <div className="flex items-center justify-between">
            <span className="font-heading text-base font-semibold">Grand Total</span>
            <span className="font-heading text-xl font-bold text-accent">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
