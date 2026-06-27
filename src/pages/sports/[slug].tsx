import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Target, Zap, Activity, HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SPORTS } from '@/lib/constants'
import { mockVenues, mockEvents } from '@/services/mock'
import { Section, SectionHeader, Button, EmptyState } from '@/components/ui'
import { VenueCard } from '@/components/venue-card'
import { EventCard } from '@/components/event-card'
import { cn } from '@/lib/utils'

const GRADIENTS: Record<string, string> = {
  football: 'from-zinc-950 via-zinc-900 to-zinc-800',
  cricket: 'from-zinc-950 via-zinc-800 to-zinc-700',
  badminton: 'from-zinc-900 via-zinc-950 to-zinc-850',
  pickleball: 'from-zinc-850 via-zinc-950 to-zinc-800',
  running: 'from-zinc-950 via-zinc-900 to-zinc-800',
}

function SportIcon({ sport, className }: { sport: (typeof SPORTS)[number]; className?: string }) {
  // FIXED: Safely look up components using a resolution dictionary instead of casting raw strings directly
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Football: Trophy,
    Target: Target,
    Badminton: Activity, 
    Zap: Zap,
    Activity: Activity
  }
  
  const IconComponent = iconMap[sport.icon] || HelpCircle
  return <IconComponent className={className} />
}

export default function SportDetailPage() {
  const { slug } = useParams()
  const sport = SPORTS.find((s) => s.slug === slug)

  if (!sport) {
    const fallbackIcon = Trophy as unknown as LucideIcon
    return (
      <div className="pb-24">
        <Section className="pt-32">
          <EmptyState
            icon={fallbackIcon}
            title="Sport not found"
            description="The sport you're looking for doesn't exist."
            action={{ label: 'Back to sports', to: '/sports' }}
          />
        </Section>
      </div>
    )
  }

  const venues = mockVenues.filter((v) => v.sport === sport.slug)
  const events = mockEvents.filter((e) => e.sport === sport.slug)

  // Fallback safe components for EmptyState tracking hooks
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Football: Trophy,
    Target: Target,
    Badminton: Activity, 
    Zap: Zap,
    Activity: Activity
  }
  const EmptyStateIcon = (iconMap[sport.icon] || HelpCircle) as unknown as LucideIcon

  return (
    <div className="pb-24">
      {/* Hero Banner Section Header */}
      <section className="relative overflow-hidden bg-zinc-950 pt-28">
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br',
            GRADIENTS[sport.slug] ?? 'from-zinc-950 to-zinc-800',
          )}
        />
        <div className="relative">
          <Section className="py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between"
            >
              <div className="max-w-2xl">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                  <SportIcon sport={sport} className="h-10 w-10 text-accent" />
                </div>
                <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {sport.name}
                </h1>
                <p className="mt-4 text-lg font-medium text-accent">{sport.tagline}</p>
                <p className="mt-4 max-w-xl text-base text-zinc-300">{sport.description}</p>
              </div>
              
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  variant="accent"
                  className="bg-accent text-zinc-950 hover:bg-accent/90"
                >
                  <Link to={`/booking?sport=${sport.slug}`}>Book {sport.name} ground</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Link to={`/venues?sport=${sport.slug}`}>View venues</Link>
                </Button>
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* Venues Grid Results Section */}
      <Section>
        <SectionHeader
          eyebrow={`${sport.name} grounds`}
          title={`Popular ${sport.name} grounds`}
          description="Top-rated venues for your game."
          align="left"
        />
        {venues.length === 0 ? (
          <EmptyState
            icon={EmptyStateIcon}
            title={`No ${sport.name} grounds yet`}
            description="Check back soon — new venues are being added."
          />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        )}
      </Section>

      {/* Events Grid Results Section */}
      <Section>
        <SectionHeader
          eyebrow={`${sport.name} matches`}
          title={`Upcoming ${sport.name} matches`}
          description="Join a game happening near you."
          align="left"
        />
        {events.length === 0 ? (
          <EmptyState
            icon={EmptyStateIcon}
            title={`No upcoming ${sport.name} matches`}
            description="Events will appear here as they're scheduled."
          />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </Section>

      {/* High-Level Analytical Meta Stats Block */}
      <Section>
        <SectionHeader
          eyebrow={`About`}
          title={`About ${sport.name}`}
          description={sport.description}
          align="left"
        />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            { label: 'Available grounds', value: `${venues.length} venues` },
            { label: 'Upcoming matches', value: `${events.length} events` },
            { label: 'Cities covered', value: 'Gandhinagar & Ahmedabad' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card rounded-2xl border border-ink/5 p-6 dark:border-surface/10"
            >
              <p className="text-sm text-muted">{stat.label}</p>
              {/* FIXED: Injected explicit text-ink foreground utility class */}
              <p className="mt-1 font-heading text-2xl font-semibold text-ink">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  )
}