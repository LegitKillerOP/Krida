import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, Calendar, MapPin, Clock, ArrowRight, Home, Download, Mail, Wallet } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

interface ConfirmationProps {
  booking: {
    id: string
    venueName: string
    sport: string
    date: string
    time: string
    price: number
  }
  userEmail?: string
}

export function Confirmation({ booking, userEmail }: ConfirmationProps) {
  function handleDownloadReceipt() {
    const separator = '═'.repeat(48)
    const line = '─'.repeat(48)
    const text = `
${separator}
              KRIDA — BOOKING RECEIPT
${separator}

Booking ID:    ${booking.id}
Date:          ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

─── VENUE ─────────────────────────────────────
Venue:         ${booking.venueName}
Sport:         ${booking.sport.charAt(0).toUpperCase() + booking.sport.slice(1)}

─── BOOKING DETAILS ───────────────────────────
Date:          ${new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Time:          ${booking.time}

─── PAYMENT ───────────────────────────────────
Amount:        ${formatPrice(booking.price)}
Payment ID:    ${booking.id}
Status:        CONFIRMED

${line}
Thank you for booking with KRIDA!
For support: support@krida.app
${separator}
`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KRIDA-Receipt-${booking.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="flex flex-col items-center text-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute inset-0 rounded-full bg-accent blur-2xl"
        />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent/15">
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <CheckCircle className="h-14 w-14 text-accent" strokeWidth={2} />
          </motion.div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="font-heading text-2xl font-bold sm:text-3xl"
      >
        Booking Confirmed!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-2 text-muted"
      >
        Your slot has been reserved successfully.
      </motion.p>

      {/* Booking ID */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 rounded-xl border border-ink/10 bg-ink/5 px-6 py-3 dark:border-surface/10 dark:bg-ink/5"
      >
        <p className="text-xs text-muted">Booking ID</p>
        <p className="font-heading text-lg font-bold tracking-wider">{booking.id}</p>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8 w-full max-w-sm space-y-4 rounded-2xl border border-ink/10 bg-white p-6 dark:border-surface/10 dark:bg-ink/5"
      >
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted" />
          <div className="text-left">
            <p className="text-xs text-muted">Venue</p>
            <p className="text-sm font-medium">{booking.venueName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted" />
          <div className="text-left">
            <p className="text-xs text-muted">Sport</p>
            <p className="text-sm font-medium capitalize">{booking.sport}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted" />
          <div className="text-left">
            <p className="text-xs text-muted">Date</p>
            <p className="text-sm font-medium">{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted" />
          <div className="text-left">
            <p className="text-xs text-muted">Time</p>
            <p className="text-sm font-medium">{booking.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Wallet className="h-4 w-4 text-muted" />
          <div className="text-left">
            <p className="text-xs text-muted">Payment</p>
            <p className="text-sm font-medium">Pay at Venue</p>
          </div>
        </div>

        <div className="border-t border-ink/10 pt-4 dark:border-surface/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Total Paid</span>
            <span className="font-heading text-lg font-bold text-accent">
              {formatPrice(booking.price)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Email notification */}
      {userEmail && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="mt-4 flex items-center gap-2 text-sm text-muted"
        >
          <Mail className="h-4 w-4 text-accent" />
          <span>Receipt sent to <span className="font-medium text-ink dark:text-surface">{userEmail}</span></span>
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Button variant="default" size="lg" className="gap-2" onClick={handleDownloadReceipt}>
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
        <Link to="/profile">
          <Button variant="outline" size="lg" className="gap-2">
            View Bookings
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}
