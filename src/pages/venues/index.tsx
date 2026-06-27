import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SPORTS, type SportSlug } from '@/lib/constants'
import { getVenues } from '@/services/db'
import { Section, SectionHeader, EmptyState } from '@/components/ui'
import { VenueCard } from '@/components/venue-card'
import { cn } from '@/lib/utils'

type SortKey = 'rating' | 'price-asc' | 'price-desc' | 'reviews'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'rating', label: 'Top rated' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'reviews', label: 'Most reviewed' },
]

export default function VenuesIndex() {
  const [sport, setSport] = useState<SportSlug | 'all'>('all')
  const [city, setCity] = useState<'all' | 'Gandhinagar' | 'Ahmedabad'>('all')
  const [maxPrice, setMaxPrice] = useState<number>(2000)
  const [sort, setSort] = useState<SortKey>('rating')

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
  })

  const cities = useMemo(() => {
    const set = new Set(venues.map((v) => v.city))
    return Array.from(set)
  }, [venues])

  const filtered = useMemo(() => {
    let list = venues.filter((v) => {
      if (sport !== 'all' && v.sport !== sport) return false
      if (city !== 'all' && v.city !== city) return false
      if (v.price > maxPrice) return false
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'reviews':
          return b.reviewCount - a.reviewCount
        case 'rating':
        default:
          return b.rating - a.rating
      }
    })

    return list
  }, [venues, sport, city, maxPrice, sort])

  return (
    <div className="pb-24">
      <Section className="pt-28">
        <SectionHeader
          eyebrow="Venues"
          title="Find your ground"
          description="Browse premium sports venues across Gandhinagar & Ahmedabad."
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
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-3">
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

            <select
              value={city}
              onChange={(e) => setCity(e.target.value as 'all' | 'Gandhinagar' | 'Ahmedabad')}
              aria-label="Filter by city"
              className="h-10 rounded-xl border border-ink/10 bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:border-surface/10 dark:bg-neutral-900 dark:text-surface"
            >
              <option value="all" className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort venues"
              className="h-10 rounded-xl border border-ink/10 bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:border-surface/10 dark:bg-neutral-900 dark:text-surface"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} className="bg-white text-ink dark:bg-neutral-900 dark:text-surface">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            {filtered.length} {filtered.length === 1 ? 'venue' : 'venues'} found
          </span>
          {(sport !== 'all' || city !== 'all' || maxPrice < 2000) && (
            <button
              type="button"
              onClick={() => {
                setSport('all')
                setCity('all')
                setMaxPrice(2000)
              }}
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className={cn('mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3')}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-ink/5 dark:bg-surface/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            title="No venues match your filters"
            description="Try widening your search by adjusting sport, city, or price."
          />
        ) : (
          <div className={cn('mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3')}>
            {filtered.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
