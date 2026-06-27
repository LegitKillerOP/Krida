import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Compass } from 'lucide-react'
import { Button } from '@/components/ui'
import { Section } from '@/components/ui'

export function NotFoundPage() {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <div className="mx-auto max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-ink/5 dark:bg-surface/10">
            <Compass className="h-12 w-12 text-muted" />
          </div>
          <p className="font-heading text-7xl font-bold tracking-tight text-accent">404</p>
          <h1 className="mt-4 font-heading text-2xl font-semibold">Lost your way?</h1>
          <p className="mt-3 text-muted">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on the field.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </motion.div>
      </div>
    </Section>
  )
}
