import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Section, SectionHeader } from '@/components/ui'
import { getReviewsByVenue } from '@/services/db'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Testimonials() {
  const { data: reviews = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getReviewsByVenue('v_001'),
  })

  const displayReviews = reviews.slice(0, 3)

  return (
    <Section id="testimonials">
      <SectionHeader
        eyebrow="TESTIMONIALS"
        title="What players are saying"
        className="mb-16"
      />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {displayReviews.map((review) => (
          <motion.div
            key={review.id}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col rounded-3xl border border-ink/10 bg-white p-8 dark:border-surface/10 dark:bg-ink/5"
          >
            {/* Quote icon */}
            <Quote className="mb-4 h-8 w-8 text-accent/40" />

            {/* Stars */}
            <div className="mb-4 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-ink/10 text-ink/10 dark:fill-surface/10 dark:text-surface/10'
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="flex-1 text-sm leading-relaxed text-ink/80 dark:text-surface/80">
              "{review.comment}"
            </p>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-6 dark:border-surface/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-surface dark:bg-surface dark:text-ink">
                {review.userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-surface">
                  {review.userName}
                </p>
                <p className="text-xs text-muted">Player</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
