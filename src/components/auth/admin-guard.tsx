import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="card max-w-md p-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 dark:bg-surface/10">
            <ShieldAlert className="h-7 w-7 text-muted" />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-ink dark:text-surface">
            Admin access required
          </h2>
          <p className="mt-2 text-sm text-muted">
            You need to be signed in as an admin to access this page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/login">
              <Button variant="accent" size="lg">
                Sign In
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="card max-w-md p-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <ShieldAlert className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-ink dark:text-surface">
            Access denied
          </h2>
          <p className="mt-2 text-sm text-muted">
            You don't have permission to access the admin dashboard. If you believe this is an error, contact an administrator.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button variant="accent" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
