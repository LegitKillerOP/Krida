import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-28 sm:px-8 sm:py-36 lg:px-12 dark:bg-surface">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" className="text-surface dark:text-ink" />
        </svg>
        <svg
          className="absolute -right-20 -top-20 h-96 w-96 opacity-[0.08]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" fill="none" className="text-surface dark:text-ink" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" fill="none" className="text-surface dark:text-ink" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1" fill="none" className="text-surface dark:text-ink" />
        </svg>
        <svg
          className="absolute -bottom-20 -left-20 h-72 w-72 opacity-[0.06]"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="none" className="text-surface dark:text-ink" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <h2 className="font-heading text-4xl font-bold tracking-tight text-surface sm:text-5xl lg:text-6xl dark:text-ink">
          Ready to play<span className="text-accent">?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base text-surface/70 sm:text-lg dark:text-ink/70">
          Join hundreds of players across Gandhinagar & Ahmedabad. Book your first slot today.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
        </div>
      </motion.div>
    </section>
  )
}
