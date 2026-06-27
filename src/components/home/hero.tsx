import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-surface px-6 sm:px-8 lg:px-12">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" className="text-ink" />
        </svg>
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
        
        {/* FIXED: Changed dark:bg-surface/15 to dark:bg-ink/10 so it glows lightly in dark mode */}
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-ink/5 blur-3xl dark:bg-ink/10" />
        
        <svg
          className="absolute right-1/4 top-1/3 h-72 w-72 opacity-[0.06]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" fill="none" className="text-ink" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-ink" />
          <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1" fill="none" className="text-ink" />
        </svg>
        <svg
          className="absolute bottom-1/4 left-1/5 h-48 w-48 opacity-[0.05]"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="none" className="text-ink" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} custom={0} className="mb-8 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Gandhinagar · Ahmedabad
            </span>
          </motion.div>

          {/* Heading */}
          {/* FIXED: Removed `dark:text-surface` so it relies cleanly on responsive `text-ink` */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-7xl lg:text-8xl"
          >
            <span className="block">
              PLAY<span className="text-accent">.</span>
            </span>
            <span className="block">
              CONNECT<span className="text-accent">.</span>
            </span>
            <span className="block">
              COMPETE<span className="text-accent">.</span>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-8 max-w-xl text-base text-muted sm:text-lg"
          >
            Book sports venues, join events, and meet players across Gandhinagar & Ahmedabad.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" variant="accent" asChild>
              <a href="/booking">Book a slot</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-surface/30 text-surface hover:bg-surface/10 dark:border-ink/30 dark:text-ink dark:hover:bg-ink/10"
              asChild
            >
              <a href="/events">Explore events</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}