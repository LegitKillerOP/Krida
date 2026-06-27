import { motion } from 'framer-motion'
import {
  Volleyball,
  Target,
  Zap,
  Activity,
  Disc3,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section, SectionHeader, Badge } from '@/components/ui'
import { SPORTS, type SportSlug } from '@/lib/constants'

const ICON_MAP: Record<SportSlug, LucideIcon> = {
  football: Volleyball,
  cricket: Target,
  badminton: Disc3,
  pickleball: Zap,
  running: Activity,
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Sports() {
  return (
    <Section id="sports">
      <SectionHeader
        eyebrow="SPORTS"
        title="Pick your game"
        className="mb-16"
      />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SPORTS.map((sport, i) => {
          const Icon = ICON_MAP[sport.slug as SportSlug]
          const isLarge = i === 0
          return (
            <motion.div
              key={sport.slug}
              variants={item}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-8 dark:border-surface/10 dark:bg-ink/5 ${
                isLarge ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Badge */}
              <div className="absolute right-6 top-6">
                <Badge variant="success">Available today</Badge>
              </div>

              {/* Icon */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/5 dark:bg-surface/10">
                <Icon className="h-8 w-8 text-ink dark:text-surface" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="font-heading text-2xl font-semibold text-ink dark:text-surface">
                {sport.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">{sport.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{sport.description}</p>

              {/* Link */}
              <Link
                to={`/sports/${sport.slug}`}
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink transition-colors hover:text-accent dark:text-surface dark:hover:text-accent"
              >
                Explore
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
