import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { pathname } = useLocation()
  const { isAuthenticated, user } = useAuth()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: 'easeOut' as const }}
          className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-24 text-surface lg:hidden"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-6 top-6 rounded-full p-2 text-surface/70 hover:bg-surface/10 hover:text-surface"
          >
            <X className="h-6 w-6" />
          </button>

          <nav className="flex flex-1 flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.to || pathname.startsWith(`${link.to}/`)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={cn(
                    'rounded-xl px-4 py-3 text-2xl font-heading font-semibold transition-colors',
                    active
                      ? 'bg-accent text-ink'
                      : 'text-surface/80 hover:bg-surface/10 hover:text-surface',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-surface/10 pt-6">
            {isAuthenticated && user ? (
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-surface/10"
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-surface/60">{user.email}</p>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="rounded-full border border-surface/20 px-6 py-3 text-center font-medium hover:bg-surface/10"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="rounded-full bg-accent px-6 py-3 text-center font-medium text-ink hover:bg-accent/90"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
