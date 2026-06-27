import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, ArrowLeft, Check, X as XIcon, Trophy, Target, Zap, Activity, HelpCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SPORTS } from '@/lib/constants'
import { getVenueById, getReviewsByVenue } from '@/services/db'
import { Section, SectionHeader, Badge, Button, EmptyState } from '@/components/ui'
import { cn, formatPrice, formatDate } from '@/lib/utils'

const SPORT_BY_SLUG = SPORTS.reduce<Record<string, (typeof SPORTS)[number]>>((acc, s) => {
  acc[s.slug] = s
  return acc
}, {})

const GRADIENTS: Record<string, string> = {
  football: 'from-emerald-950 via-emerald-900 to-teal-900',
  cricket: 'from-blue-950 via-indigo-950 to-slate-900',
  badminton: 'from-purple-950 via-zinc-900 to-fuchsia-950',
  pickleball: 'from-cyan-950 via-sky-900 to-zinc-900',
  running: 'from-neutral-950 via-zinc-900 to-neutral-800',
}

function buildSlots(slots: string[]) {
  return slots.map((time, idx) => {
    let state: 'available' | 'unavailable' | 'booked' = 'available'
    if (idx >= 2 && idx < 6) state = 'unavailable'
    else if (idx >= 10 && idx < 12) state = 'booked'
    return { time, state }
  })
}

export default function VenueDetailPage() {
  const { id } = useParams()

  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => getVenueById(id!),
    enabled: !!id,
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsByVenue(id!),
    enabled: !!id,
  })

  if (venueLoading) {
    return (
      <div className="pb-24">
        <Section className="pt-32">
          <div className="h-96 animate-pulse rounded-3xl bg-ink/5 dark:bg-surface/5" />
        </Section>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="pb-24">
        <Section className="pt-32">
          <EmptyState
            icon={MapPin}
            title="Venue not found"
            description="The venue you're looking for doesn't exist or has been removed."
            action={{ label: 'Back to venues', to: '/venues' }}
          />
        </Section>
      </div>
    )
  }

  const sport = SPORT_BY_SLUG[venue.sport]
  const gradient = GRADIENTS[venue.sport] ?? 'from-zinc-900 to-zinc-800'

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Football: Trophy,
    Target: Target,
    Badminton: Activity,
    Zap: Zap,
    Activity: Activity
  }
  const IconComponent = iconMap[sport?.icon || ''] || HelpCircle

  const slots = buildSlots(venue.slots ?? [])

  return (
    <div className="pb-32 lg:pb-24">
      {/* Back Button Navigation Header */}
      <div className="px-6 pt-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/venues"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to venues
          </Link>
        </div>
      </div>

      {/* Hero Header Presentation Banner Card */}
      <div className="mx-auto mt-6 max-w-7xl px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'relative flex h-64 items-end overflow-hidden rounded-3xl bg-gradient-to-br p-8 sm:h-80 lg:h-96',
            gradient,
          )}
        >
          <IconComponent className="absolute -right-8 -top-8 h-56 w-56 text-white/10 sm:h-72 sm:w-72" />

          <div className="relative z-10 flex w-full flex-wrap items-end justify-between gap-6">
            <div>
              <Badge variant="outline" className="border-white/20 bg-black/30 text-white backdrop-blur">
                {sport?.name ?? venue.sport}
              </Badge>
              <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {venue.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-white/80">
                <span className="flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {venue.address}, {venue.city}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {venue.rating.toFixed(1)} ({venue.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-sm text-white/60">Starting from</p>
              <p className="font-heading text-3xl font-bold text-white sm:text-4xl">
                {venue.price === 0 ? 'Free' : formatPrice(venue.price)}
                {venue.price > 0 && <span className="text-base font-normal text-white/60">/hr</span>}
              </p>
              {venue.weekendPrice && (
                <p className="text-sm text-white/50 mt-0.5">Weekends {formatPrice(venue.weekendPrice)}/hr</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Grid Content Matrix Layout Split area */}
      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-10 px-6 sm:px-8 lg:grid-cols-3 lg:px-12">
        <div className="space-y-12 lg:col-span-2">
          {/* About description layout container block */}
          <Section className="px-0 py-0">
            <SectionHeader eyebrow="About" title="About this venue" align="left" />
            <p className="mt-4 text-base leading-relaxed text-muted">
              {venue.description ?? 'A premium sports facility with top-notch amenities for players of all levels.'}
            </p>
          </Section>

          {/* Amenities Features Badges container block */}
          <div>
            <SectionHeader eyebrow="Facilities" title="What's available" align="left" />
            <div className="mt-4 flex flex-wrap gap-2">
              {venue.facilities?.map((f) => (
                <Badge
                  key={f}
                  variant="outline"
                  className="rounded-xl px-3 py-1.5 text-sm font-normal border-ink/10 dark:border-surface/10 text-ink"
                >
                  {f}
                </Badge>
              ))}
            </div>
          </div>

          {/* Time Slot Scheduler Interface Grid */}
          <div>
            <SectionHeader eyebrow="Today" title="Available slots today" align="left" />
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={s.state !== 'available'}
                  className={cn(
                    'rounded-xl border px-2 py-3 text-xs font-medium transition-colors',
                    s.state === 'available' &&
                      'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700',
                    s.state === 'unavailable' &&
                      'cursor-not-allowed border-ink/5 bg-ink/5 text-muted line-through dark:border-surface/5',
                    s.state === 'booked' &&
                      'cursor-not-allowed border-ink/5 bg-ink/5 text-muted/60 dark:border-surface/5',
                  )}
                >
                  {s.time}
                </button>
              ))}
            </div>

            {/* Slot Legend Keys */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-ink/20 dark:bg-surface/20" /> Booked
              </span>
              <span className="flex items-center gap-1.5">
                <XIcon className="h-3 w-3 text-muted" /> Unavailable
              </span>
            </div>
          </div>

          {/* Geography Location Map Static Frame element wrapper */}
          <div>
            <SectionHeader eyebrow="Location" title="Getting there" align="left" />
            <div className="card mt-4 flex h-48 items-center justify-center rounded-2xl border border-ink/5 dark:border-surface/10">
              <div className="text-center text-muted p-4">
                <MapPin className="mx-auto h-8 w-8 text-muted" />
                <p className="mt-2 text-sm text-ink font-medium">{venue.address}</p>
                <p className="text-xs text-muted mt-0.5">
                  {venue.lat?.toFixed(4)}, {venue.lng?.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* User Reviews Module Layout section */}
          <div>
            <SectionHeader eyebrow="Reviews" title={`Reviews (${reviews.length})`} align="left" />
            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No reviews yet. Be the first to share your experience.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {reviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="card rounded-2xl border border-ink/5 p-5 dark:border-surface/10"
                  >
                    <div className="flex items-center gap-3">
                      {r.userPhoto ? (
                        <img src={r.userPhoto} alt={r.userName} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-sm font-semibold text-ink dark:bg-surface/10">
                          {r.userName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{r.userName}</p>
                        <p className="text-xs text-muted">{formatDate(r.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-ink">
                        <Star className="h-4 w-4 fill-ink text-ink dark:fill-surface dark:text-surface" />
                        <span>{r.rating}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{r.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Sticky Panel - Desktop Booking Interface layout card */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl text-white">
            <p className="text-sm text-neutral-400">Book this venue</p>
            <p className="mt-1 font-heading text-3xl font-bold text-white">
              {venue.price === 0 ? 'Free' : formatPrice(venue.price)}
              {venue.price > 0 && <span className="text-sm font-normal text-neutral-400">/hr</span>}
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {['Instant confirmation', 'Free cancellation', 'Secure payment'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-neutral-300">{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" variant="accent" className="mt-6 w-full">
              <Link to={`/booking?venue=${venue.id}`}>Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="mt-3 w-full border-neutral-800 hover:bg-neutral-800 text-white bg-transparent">
              <Link to={`/events?venue=${venue.id}`}>View events here</Link>
            </Button>
          </div>
        </aside>
      </div>

      {/* Floating Bottom Navigation Bar - Mobile layout viewport support */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-800 bg-neutral-900/95 p-4 backdrop-blur lg:hidden text-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <p className="font-heading text-lg font-semibold text-white">
              {venue.price === 0 ? 'Free' : formatPrice(venue.price)}
              {venue.price > 0 && <span className="text-sm font-normal text-neutral-400">/hr</span>}
            </p>
            <p className="text-xs text-neutral-400">Available today</p>
          </div>
          <Button asChild variant="accent" size="lg">
            <Link to={`/booking?venue=${venue.id}`}>Book Now</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
