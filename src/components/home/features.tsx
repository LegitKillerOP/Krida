import { motion } from 'framer-motion'
import {
  CalendarCheck,
  Users,
  Trophy,
  ClipboardList,
  Heart,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: CalendarCheck,
    title: 'Book Grounds',
    description: 'Browse real-time availability and book premium sports grounds in seconds.',
  },
  {
    icon: Users,
    title: 'Join Events',
    description: 'Find community matches, tournaments, and open plays near you.',
  },
  {
    icon: Trophy,
    title: 'Host Matches',
    description: 'Create your own events, manage slots, and grow your local community.',
  },
  {
    icon: ClipboardList,
    title: 'Track Bookings',
    description: 'See all your upcoming and past bookings in one clean dashboard.',
  },
  {
    icon: Heart,
    title: 'Community',
    description: 'Connect with players who share your passion and skill level.',
  },
  {
    icon: Search,
    title: 'Find Players',
    description: 'Discover players looking for teammates in your area and sport.',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Features() {
  return (
    <Section id="features">
      <SectionHeader
        eyebrow="WHAT WE DO"
        title="Everything you need to play"
        className="mb-16"
      />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-3xl border border-ink/10 bg-white p-8 dark:border-surface/10 dark:bg-ink/5"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5 dark:bg-surface/10">
              <f.icon className="h-7 w-7 text-ink dark:text-surface" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-lg font-semibold text-ink dark:text-surface">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
