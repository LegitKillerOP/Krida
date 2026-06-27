import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Calendar, Trophy } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { useSearch } from '@/store/search'
import { getVenues, getEvents } from '@/services/db'
import { SPORTS } from '@/lib/constants'
import { cn, formatPrice } from '@/lib/utils'

const SPORT_BY_SLUG = SPORTS.reduce<Record<string, (typeof SPORTS)[number]>>((acc, s) => {
  acc[s.slug] = s
  return acc
}, {})

function useClickOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])
  return ref
}

export function SearchDialog() {
  const { isOpen, query, setQuery, close } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useClickOutside(close)

  const { data: venues = [] } = useQuery({
    queryKey: ['search-venues'],
    queryFn: getVenues,
  })

  const { data: events = [] } = useQuery({
    queryKey: ['search-events'],
    queryFn: getEvents,
  })

  useEffect(() => {
    if (!isOpen) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, close])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const q = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!q) return { venues: [], events: [], sports: [] }
    const filteredVenues = venues.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.sport.toLowerCase().includes(q),
    )
    const filteredEvents = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.sport.toLowerCase().includes(q),
    )
    const sports = SPORTS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.slug.includes(q),
    )
    return { venues: filteredVenues, events: filteredEvents, sports }
  }, [q, venues, events])

  const total = results.venues.length + results.events.length + results.sports.length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
          aria-hidden="false"
        >
          <motion.div
            key="search-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
            className="mx-auto mt-20 w-full max-w-2xl origin-top rounded-2xl border border-ink/10 bg-white shadow-2xl dark:border-surface/10 dark:bg-ink"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-4 dark:border-surface/10">
              <Search className="h-5 w-5 text-muted" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search venues, events, sports…"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="rounded-full p-2 text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-surface/10 dark:hover:text-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {!q && (
                <p className="py-12 text-center text-sm text-muted">
                  Start typing to find venues, events and sports.
                </p>
              )}

              {q && total === 0 && (
                <p className="py-12 text-center text-sm text-muted">
                  No results for "<span className="text-ink dark:text-surface">{query}</span>"
                </p>
              )}

              {results.sports.length > 0 && (
                <ResultGroup icon={Trophy} label="Sports">
                  {results.sports.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/sports/${s.slug}`}
                      onClick={close}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-ink/5 dark:hover:bg-surface/10"
                    >
                      <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink dark:text-surface">
                        {s.name}
                      </span>
                      <span className="text-muted">{s.tagline}</span>
                    </Link>
                  ))}
                </ResultGroup>
              )}

              {results.events.length > 0 && (
                <ResultGroup icon={Calendar} label="Events">
                  {results.events.map((e) => (
                    <Link
                      key={e.id}
                      to={`/events/${e.id}`}
                      onClick={close}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-ink/5 dark:hover:bg-surface/10"
                    >
                      <div>
                        <p className="font-medium">{e.title}</p>
                        <p className="text-xs text-muted">
                          {e.venue} · {SPORT_BY_SLUG[e.sport]?.name ?? e.sport}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {e.fee === 0 ? 'Free' : formatPrice(e.fee)}
                      </span>
                    </Link>
                  ))}
                </ResultGroup>
              )}

              {results.venues.length > 0 && (
                <ResultGroup icon={MapPin} label="Venues">
                  {results.venues.map((v) => (
                    <Link
                      key={v.id}
                      to={`/venues/${v.id}`}
                      onClick={close}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-ink/5 dark:hover:bg-surface/10"
                    >
                      <img
                        src={v.images?.[0]}
                        alt={v.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-xs text-muted">
                          {v.city} · {SPORT_BY_SLUG[v.sport]?.name ?? v.sport}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(v.price)}/hr</span>
                    </Link>
                  ))}
                </ResultGroup>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ResultGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}
