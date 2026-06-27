import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Users, MapPin, User } from 'lucide-react'
import { SPORTS } from '@/lib/constants'
import { mockEvents, mockUser } from '@/services/mock'
import { Section, SectionHeader, Badge, Button, EmptyState } from '@/components/ui'
import { cn, formatPrice, formatDate } from '@/lib/utils'

const SPORT_BY_SLUG = SPORTS.reduce<Record<string, (typeof SPORTS)[number]>>((acc, s) => {
  acc[s.slug] = s
  return acc
}, {})

export default function EventDetailPage() {
  const { id } = useParams()
  const event = mockEvents.find((e) => e.id === id)
  const [joined, setJoined] = useState(() => event?.participants.includes(mockUser.id) ?? false)

  if (!event) {
    return (
      <div className="pb-24">
        <Section className="pt-32">
          <EmptyState
            icon={Calendar}
            title="Event not found"
            description="The event you're looking for doesn't exist or has been removed."
            action={{ label: 'Back to events', to: '/events' }}
          />
        </Section>
      </div>
    )
  }

  const sport = SPORT_BY_SLUG[event.sport]
  const isFull = event.status === 'full' || event.slots >= event.maxSlots
  const isCompleted = event.status === 'completed' || event.status === 'cancelled'
  const canJoin = !isFull && !isCompleted

  return (
    <div className="pb-32 lg:pb-24">
      <div className="px-6 pt-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-10 px-6 sm:px-8 lg:grid-cols-3 lg:px-12">
        <div className="space-y-10 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card overflow-hidden"
          >
            <div className="relative h-48 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 sm:h-64">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,255,77,0.15),transparent_50%)]" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2">
                <Badge 
                  variant="outline" 
                  style={{ color: 'var(--color-surface)', borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(10,10,10,0.3)' }}
                  className="backdrop-blur"
                >
                  {sport?.name ?? event.sport}
                </Badge>
                {isFull && <Badge variant="danger">Full</Badge>}
                {isCompleted && <Badge variant="default">Ended</Badge>}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* FIXED: Swapped out conflicting classes for direct token variable style mappings */}
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--color-ink)' }}>
                {event.title}
              </h1>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { icon: Calendar, label: 'Date', value: formatDate(event.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) },
                  { icon: Clock, label: 'Time', value: event.time },
                  { icon: Users, label: 'Slots left', value: `${event.slots} of ${event.maxSlots}` },
                  { icon: User, label: 'Hosted by', value: event.host },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3 rounded-xl p-3 bg-neutral-100 dark:bg-neutral-800/50">
                    <row.icon className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{row.label}</p>
                      {/* FIXED: Forced active native variable mapping for data strings */}
                      <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-5 border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Entry fee</p>
                  {/* FIXED: Replaced standard dark utilities with variable inheritance to prevent white-on-white text */}
                  <p className="font-heading text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                    {event.fee === 0 ? 'Free' : formatPrice(event.fee)}
                  </p>
                </div>
                {canJoin && (
                  <Button
                    variant={joined ? 'outline' : 'accent'}
                    size="lg"
                    onClick={() => setJoined((j) => !j)}
                  >
                    {joined ? 'Leave event' : 'Join event'}
                  </Button>
                )}
                {isFull && <Button variant="outline" size="lg" disabled>Event full</Button>}
                {isCompleted && <Button variant="ghost" size="lg" disabled>Ended</Button>}
              </div>
            </div>
          </motion.div>

          <Section className="px-0 py-0">
            <SectionHeader eyebrow="Details" title="About this event" align="left" />
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--color-muted)' }}>{event.description}</p>
          </Section>

          <div>
            <SectionHeader eyebrow="Participants" title={`Players (${event.participants.length})`} align="left" />
            <div className="mt-4 flex flex-wrap gap-2">
              {event.participants.slice(0, 12).map((pid, i) => (
                <div
                  key={pid}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold bg-neutral-100 dark:bg-neutral-800"
                  style={{ color: 'var(--color-ink)' }}
                  title={`Player ${i + 1}`}
                >
                  {pid.replace('u_', 'P')}
                </div>
              ))}
              {event.participants.length > 12 && (
                <div className="flex h-10 items-center rounded-full px-3 text-sm font-medium bg-neutral-100 dark:bg-neutral-800" style={{ color: 'var(--color-ink)' }}>
                  +{event.participants.length - 12} more
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Venue" title="Where it's happening" align="left" />
            <Link
              to={`/venues/${event.venueId}`}
              className="card mt-4 flex items-center gap-4 p-5 transition-shadow hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: 'var(--color-ink)' }}>{event.venue}</p>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>View venue details</p>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" style={{ color: 'var(--color-muted)' }} />
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Event summary</p>
            <p className="mt-1 font-heading text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
              {event.fee === 0 ? 'Free' : formatPrice(event.fee)}
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Date</span>
                <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{formatDate(event.date, { day: 'numeric', month: 'short' })}</span>
              </li>
              <li className="flex items-center justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Time</span>
                <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{event.time}</span>
              </li>
              <li className="flex items-center justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Slots</span>
                <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{event.slots}/{event.maxSlots}</span>
              </li>
              <li className="flex items-center justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Venue</span>
                <Link to={`/venues/${event.venueId}`} className="font-medium text-accent hover:underline">
                  {event.venue}
                </Link>
              </li>
            </ul>
            {canJoin && (
              <Button
                variant={joined ? 'outline' : 'accent'}
                size="lg"
                className="mt-6 w-full text-black"
                onClick={() => setJoined((j) => !j)}
              >
                {joined ? 'Leave event' : 'Join event'}
              </Button>
            )}
          </div>
        </aside>
      </div>

      {canJoin && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed inset-x-0 bottom-0 z-30 border-t p-4 backdrop-blur lg:hidden bg-white/90 dark:bg-neutral-900/90 border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              {/* FIXED: Explicitly map native variable variables here for absolute view state sync */}
              <p className="font-heading text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>
                {event.fee === 0 ? 'Free' : formatPrice(event.fee)}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                {event.slots} {event.slots === 1 ? 'slot' : 'slots'} left
              </p>
            </div>
            <Button
              variant={joined ? 'outline' : 'accent'}
              size="lg"
              onClick={() => setJoined((j) => !j)}
            >
              {joined ? 'Leave' : 'Join event'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}