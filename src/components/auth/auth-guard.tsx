import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className="card max-w-md p-10 text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 dark:bg-surface/10">
          <Lock className="h-7 w-7 text-muted" />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-ink dark:text-surface">
          Log in to continue
        </h2>
        <p className="mt-2 text-sm text-muted">
          You need to be signed in to access this page. Sign in or create an account to get started.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/login">
            <Button variant="accent" size="lg">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Create Account
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
