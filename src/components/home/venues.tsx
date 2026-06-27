import { motion } from 'framer-motion'
import { MapPin, Star, Volleyball, Target, Zap, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Section, SectionHeader } from '@/components/ui'
import { getVenues } from '@/services/db'
import { formatPrice } from '@/lib/utils'
import type { SportSlug } from '@/lib/constants'

const SPORT_ICON: Record<string, typeof Volleyball> = {
  football: Volleyball,
  cricket: Target,
  badminton: Volleyball,
  pickleball: Zap,
  running: Activity,
}

const GRADIENTS: Record<string, string> = {
  football: 'from-emerald-200 to-emerald-400',
  cricket: 'from-amber-200 to-amber-400',
  badminton: 'from-sky-200 to-sky-400',
  pickleball: 'from-violet-200 to-violet-400',
  running: 'from-rose-200 to-rose-400',
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Venues() {
  const { data: venues = [] } = useQuery({
    queryKey: ['home-venues'],
    queryFn: getVenues,
  })

  const displayVenues = venues.slice(0, 6)

  return (
    <Section id="venues">
      <SectionHeader
        eyebrow="POPULAR VENUES"
        title="Top-rated grounds near you"
        className="mb-16"
      />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {displayVenues.map((venue) => {
          const Icon = SPORT_ICON[venue.sport] || Volleyball
          const gradient = GRADIENTS[venue.sport] || 'from-gray-200 to-gray-400'
          return (
            <motion.div
              key={venue.id}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group overflow-hidden rounded-3xl border border-ink/10 bg-white dark:border-surface/10 dark:bg-ink/5"
            >
              {/* Image placeholder */}
              <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${gradient}`}>
                <Icon className="h-16 w-16 text-white/80" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold text-ink dark:text-surface">
                  {venue.name}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{venue.address}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm font-medium text-ink dark:text-surface">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{venue.rating}</span>
                    <span className="text-muted">({venue.reviewCount})</span>
                  </div>
                  <span className="font-heading text-lg font-semibold text-ink dark:text-surface">
                    {formatPrice(venue.price)}
                    <span className="text-xs font-normal text-muted"> / hour</span>
                  </span>
                </div>

                <Link
                  to={`/booking/${venue.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-ink/90 dark:bg-surface dark:text-ink dark:hover:bg-surface/90"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
