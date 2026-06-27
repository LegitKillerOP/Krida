import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Filter } from 'lucide-react'
import { SPORTS, type SportSlug } from '@/lib/constants'
import { mockEvents } from '@/services/mock'
import { Section, SectionHeader, EmptyState } from '@/components/ui'
import { EventCard } from '@/components/event-card'
import { todayISO } from '@/lib/utils'

function formatDropdownDate(dateString: string) {
  const parts = dateString.split('-')
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const d = new Date(year, month, day)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    })
  }
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

export default function EventsIndex() {
  const [sport, setSport] = useState<SportSlug | 'all'>('all')
  const [date, setDate] = useState<string>('all')

  const events = useMemo(() => {
    return mockEvents
      .filter((e) => e.status !== 'cancelled')
      .filter((e) => {
        if (sport !== 'all' && e.sport !== sport) return false
        if (date === 'upcoming' && e.date < todayISO()) return false
        if (date !== 'all' && date !== 'upcoming' && e.date !== date) return false
        return true
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }, [sport, date])

  const dates = useMemo(() => {
    const set = new Set(mockEvents.map((e) => e.date))
    return Array.from(set).sort()
  }, [])

  return (
    <div className="pb-24">
      <Section className="pt-28">
        <SectionHeader
          eyebrow="Events"
          title="Don't miss the next game"
          description="Join matches, tournaments, and community runs happening near you."
        />
      </Section>

      <Section className="pt-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card flex flex-col gap-4 rounded-2xl border border-ink/5 p-4 dark:border-surface/10 md:flex-row md:items-center"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </div>
          
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* FIXED: Extracted 'text-ink' classes and mapped direct child element properties to support Cross-Browser rendering engine constraints */}
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value as SportSlug | 'all')}
              aria-label="Filter by sport"
              className="h-10 rounded-xl border border-ink/10 bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:border-surface/10 dark:bg-neutral-900 dark:text-surface"
            >
              <option value="all" className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">All sports</option>
              {SPORTS.map((s) => (
                <option key={s.slug} value={s.slug} className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">
                  {s.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted" />
              {/* FIXED: Re-aligned classes to match the custom dropdown structure perfectly */}
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Filter by date"
                className="h-10 rounded-xl border border-ink/10 bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:border-surface/10 dark:bg-neutral-900 dark:text-surface"
              >
                <option value="all" className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">Any date</option>
                <option value="upcoming" className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">Upcoming</option>
                {dates.map((d) => (
                  <option key={d} value={d} className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">
                    {formatDropdownDate(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <p className="mt-4 text-sm text-ink font-medium">
          {events.length} {events.length === 1 ? 'event' : 'events'} found
        </p>

        {events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events match your filters"
            description="Try a different sport or date to find your next game."
          />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}