import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Search, Menu } from 'lucide-react'
import { Logo } from './logo'
import { MobileMenu } from './mobile-menu'
import { SearchDialog } from './search-dialog'
import { Button } from '@/components/ui'
import { useAuth } from '@/store/auth'
import { useSearch } from '@/store/search'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { pathname } = useLocation()
  const { isAuthenticated, user } = useAuth()
  const openSearch = useSearch((s) => s.open)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  const { scrollY } = useScroll()
  const [yAtTop, setYAtTop] = useState(true)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setYAtTop(latest < 10)
    if (latest > prev && latest > 120) setHidden(true)
    else if (latest < prev) setHidden(false)
  })

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'sticky top-0 z-30 w-full transition-colors duration-300',
          yAtTop
            ? 'bg-white/80 backdrop-blur-md dark:bg-ink/80'
            : 'border-b border-ink/10 bg-white/95 backdrop-blur-md dark:border-surface/10 dark:bg-ink/95',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 sm:px-8 lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.to || pathname.startsWith(`${link.to}/`)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-ink/5 text-ink dark:bg-surface/10 dark:text-surface'
                      : 'text-muted hover:text-ink dark:hover:text-surface',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="rounded-full p-2 text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-surface/10 dark:hover:text-surface"
            >
              <Search className="h-5 w-5" />
            </button>

            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-ink/5 dark:hover:bg-surface/10"
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button variant="accent" size="sm" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="rounded-full p-2 text-ink hover:bg-ink/5 dark:text-surface dark:hover:bg-surface/10 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>

      <SearchDialog />
    </>
  )
}
