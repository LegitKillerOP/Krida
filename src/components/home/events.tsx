import { motion } from 'framer-motion'
import { Clock, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Section, SectionHeader, Badge } from '@/components/ui'
import { getEvents } from '@/services/db'
import { formatPrice, formatDate } from '@/lib/utils'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Events() {
  const { data: events = [] } = useQuery({
    queryKey: ['home-events'],
    queryFn: getEvents,
  })

  const displayEvents = events
    .filter((e) => e.status === 'upcoming' || e.status === 'full')
    .slice(0, 4)

  return (
    <Section id="events">
      <SectionHeader
        eyebrow="UPCOMING EVENTS"
        title="Don't miss the next game"
        className="mb-16"
      />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative space-y-4"
      >
        {/* Timeline line */}
        <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-ink/10 dark:bg-surface/10 sm:block" />

        {displayEvents.map((event) => {
          const date = new Date(event.date)
          const day = date.toLocaleDateString('en-IN', { day: '2-digit' })
          const month = date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
          const participantCount = event.participants?.length ?? 0
          const slotsLeft = event.maxSlots - participantCount
          const slotsPercent = event.maxSlots > 0 ? (participantCount / event.maxSlots) * 100 : 0

          return (
            <motion.div
              key={event.id}
              variants={item}
              className="group relative flex flex-col gap-4 rounded-3xl border border-ink/10 bg-white p-6 transition-colors hover:bg-ink/[0.02] dark:border-surface/10 dark:bg-ink/5 dark:hover:bg-ink/[0.08] sm:flex-row sm:items-center sm:gap-6 sm:p-8"
            >
              {/* Date block */}
              <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-center sm:gap-1">
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-ink text-surface dark:bg-surface dark:text-ink">
                  <span className="text-lg font-bold leading-none">{day}</span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-80">
                    {month}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold text-ink dark:text-surface">
                    {event.title}
                  </h3>
                  <Badge variant="outline">{event.sport}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span>Hosted by {event.host}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {event.time}
                  </span>
                </div>

                {/* Slots bar */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-surface/10">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${slotsPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted">
                    {slotsLeft} / {event.maxSlots} slots
                  </span>
                </div>
              </div>

              {/* Right side: price + CTA */}
              <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <span className="font-heading text-xl font-semibold text-ink dark:text-surface">
                  {formatPrice(event.fee)}
                </span>
                <button className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-surface transition-colors hover:bg-ink/90 dark:bg-surface dark:text-ink dark:hover:bg-surface/90">
                  Join
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
