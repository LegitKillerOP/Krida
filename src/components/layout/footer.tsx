import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from './logo'
import { FOOTER_LINKS, SPORTS } from '@/lib/constants'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const CONTACT = [
  { icon: InstagramIcon, label: '@krida.sport', href: 'https://instagram.com/krida.sport' },
  { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Mail, label: 'hello@krida.in', href: 'mailto:hello@krida.in' },
  { icon: MapPin, label: 'Gandhinagar & Ahmedabad', href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-ink text-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="text-surface" />
            <p className="mt-4 max-w-xs text-sm text-surface/60">
              Book premium sports venues and join community events across Gandhinagar & Ahmedabad.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {CONTACT.slice(0, 2).map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={c.label}
                  className="rounded-full border border-surface/15 p-2 text-surface/70 transition-colors hover:border-accent hover:text-accent"
                >
                  <c.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-surface/50">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-surface/70 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-surface/50">
              Sports
            </h3>
            <ul className="mt-4 space-y-3">
              {SPORTS.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/sports/${s.slug}`}
                    className="text-sm text-surface/70 transition-colors hover:text-accent"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-surface/50">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              {CONTACT.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-surface/70 transition-colors hover:text-accent"
                  >
                    <c.icon className="h-4 w-4 shrink-0" />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-surface/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-surface/40 sm:flex-row sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} Krida. All rights reserved.</p>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
