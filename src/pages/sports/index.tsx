import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, Target, Zap, Activity, HelpCircle } from 'lucide-react'
import { SPORTS } from '@/lib/constants'
import { Section, SectionHeader } from '@/components/ui'
import { cn } from '@/lib/utils'

const GRADIENTS: Record<string, string> = {
  football: 'from-emerald-950 via-emerald-900 to-teal-800',
  cricket: 'from-blue-950 via-indigo-950 to-slate-800',
  badminton: 'from-purple-950 via-zinc-900 to-fuchsia-950',
  pickleball: 'from-cyan-950 via-sky-900 to-slate-800',
  running: 'from-neutral-950 via-zinc-900 to-neutral-800',
}

function SportIcon({ sport, className }: { sport: (typeof SPORTS)[number]; className?: string }) {
  // Safe component mapping strategy for string properties inside constants.ts
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Football: Trophy,       // Using Trophy or generic sports alternative
    Target: Target,
    Badminton: Activity,    // Standard substitute for racquet activities
    Zap: Zap,
    Activity: Activity
  }

  const IconComponent = iconMap[sport.icon] || HelpCircle

  return <IconComponent className={className} />
}

export default function SportsIndex() {
  return (
    <div className="pb-24">
      <Section className="pt-28">
        <SectionHeader
          eyebrow="Sports"
          title="Pick your game"
          description="From football to running — discover every sport available across Gandhinagar & Ahmedabad."
        />
      </Section>

      <Section className="pt-2">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SPORTS.map((sport, i) => (
            <motion.div
              key={sport.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' as const }}
              whileHover={{ y: -8 }}
            >
              <Link
                to={`/sports/${sport.slug}`}
                className="card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/5 p-8 transition-shadow duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:border-surface/10"
              >
                <div
                  className={cn(
                    'mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-inner',
                    GRADIENTS[sport.slug] ?? 'from-zinc-900 to-zinc-700',
                  )}
                >
                  <SportIcon sport={sport} className="h-7 w-7" />
                </div>

                <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink">
                  {sport.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-accent">{sport.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{sport.description}</p>

                <div className="mt-8 flex items-center gap-1.5 text-sm font-medium text-ink/80 group-hover:text-ink">
                  <span className="transition-transform duration-300 group-hover:translate-x-1">Explore</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  )
}