import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui'

const STATS = [
  { label: 'Players', suffix: '+' },
  { label: 'Venues', suffix: '+' },
  { label: 'Monthly Games', suffix: '+' },
  { label: 'Sports', suffix: '+' },
]

const TARGETS = [500, 40, 120, 15]

const AVATARS = [
  { initials: 'AP', color: 'bg-emerald-400' },
  { initials: 'RS', color: 'bg-amber-400' },
  { initials: 'VD', color: 'bg-sky-400' },
  { initials: 'PM', color: 'bg-violet-400' },
  { initials: 'SJ', color: 'bg-rose-400' },
  { initials: 'KS', color: 'bg-orange-400' },
  { initials: 'AN', color: 'bg-cyan-400' },
  { initials: 'MK', color: 'bg-pink-400' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onViewportEnter={() => count.set(0)}
      className="font-heading text-4xl font-bold text-ink dark:text-surface sm:text-5xl"
    >
      <MotionValueText value={rounded} />
      {suffix}
    </motion.span>
  )
}

function MotionValueText({ value }: { value: MotionValue<number> }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const unsubscribe = value.on('change', (v) => setDisplay(v))
    return unsubscribe
  }, [value])
  return <>{display}</>
}

export function Community() {
  return (
    <Section id="community">
      <SectionHeader
        eyebrow="THE KRIDA COMMUNITY"
        title="Built for players, by players"
        className="mb-16"
      />

      {/* Stats */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-2 gap-8 sm:grid-cols-4"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
            }}
            className="text-center"
          >
            <Counter target={TARGETS[i]} suffix={stat.suffix} />
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Avatar row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-16 flex flex-wrap items-center justify-center gap-3"
      >
        {AVATARS.map((a, i) => (
          <motion.div
            key={a.initials}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${a.color}`}
          >
            {a.initials}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.3 }}
          className="flex h-12 items-center rounded-full bg-ink/10 px-4 text-xs font-medium text-ink dark:bg-surface/10 dark:text-surface"
        >
          +492 more
        </motion.div>
      </motion.div>
    </Section>
  )
}
