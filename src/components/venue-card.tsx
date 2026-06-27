import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, Trophy, Target, Zap, Activity, HelpCircle } from 'lucide-react'
import type { Venue } from '@/types'
import { SPORTS } from '@/lib/constants'
import { Badge } from '@/components/ui'
import { cn, formatPrice } from '@/lib/utils'

const SPORT_BY_SLUG = SPORTS.reduce<Record<string, (typeof SPORTS)[number]>>((acc, s) => {
  acc[s.slug] = s
  return acc
}, {})

// FIXED: Replaced standard theme 'ink' dynamic mappings with static, deep values.
// This guarantees headers stay rich and dark across both system layouts, letting the 'text-surface/25' white icons stand out perfectly.
const GRADIENTS: Record<string, string> = {
  football: 'from-emerald-950 via-emerald-900 to-teal-900',
  cricket: 'from-blue-950 via-indigo-950 to-slate-900',
  badminton: 'from-purple-950 via-zinc-900 to-fuchsia-950',
  pickleball: 'from-cyan-950 via-sky-900 to-zinc-900',
  running: 'from-neutral-950 via-zinc-900 to-neutral-800',
}

function SportIcon({ sport, className }: { sport: string; className?: string }) {
  const meta = SPORT_BY_SLUG[sport]
  if (!meta) return <HelpCircle className={className} />

  // Map strings to core Lucide component definitions safely
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Football: Trophy,
    Target: Target,
    Badminton: Activity, 
    Zap: Zap,
    Activity: Activity
  }

  const IconComponent = iconMap[meta.icon] || HelpCircle
  return <IconComponent className={className} />
}

export function VenueCard({ venue }: { venue: Venue }) {
  const sport = SPORT_BY_SLUG[venue.sport]
  const gradient = GRADIENTS[venue.sport] ?? 'from-zinc-900 to-zinc-800'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        to={`/venues/${venue.id}`}
        className="card flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
      >
        {/* Header Preview Image Background area */}
        <div className={cn('relative flex h-44 items-center justify-center bg-gradient-to-br', gradient)}>
          <SportIcon
            sport={venue.sport}
            className="h-16 w-16 text-surface/25 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-4 top-4">
            <Badge variant="outline" className="border-surface/20 bg-ink/30 text-surface backdrop-blur">
              {sport?.name ?? venue.sport}
            </Badge>
          </div>
          {venue.price === 0 && (
            <div className="absolute right-4 top-4">
              <Badge variant="success">Free</Badge>
            </div>
          )}
        </div>

        {/* Content Body Details Area */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* FIXED: Added text-ink explicit color profile to make heading visible */}
          <h3 className="font-heading text-lg font-semibold leading-tight text-ink">
            {venue.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{venue.city}</span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-ink/5 pt-4 dark:border-surface/10">
            {/* FIXED: Forced explicit visibility for rating parameters */}
            <div className="flex items-center gap-1 text-sm font-medium text-ink">
              <Star className="h-4 w-4 fill-ink text-ink dark:fill-surface dark:text-surface" />
              <span>{venue.rating.toFixed(1)}</span>
              <span className="text-muted">({venue.reviewCount})</span>
            </div>
            {/* FIXED: Forced explicit visibility for price tag metrics */}
            <span className="font-heading text-base font-semibold text-ink">
              {venue.price === 0 ? 'Free' : `${formatPrice(venue.price)}/hr`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}