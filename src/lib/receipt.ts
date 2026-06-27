import type { Booking, Venue, User } from '@/types'
import { formatPrice, formatDate } from './utils'

export function generateReceiptText(booking: Booking, venue: Venue, user: User): string {
  const separator = '═'.repeat(48)
  const line = '─'.repeat(48)

  return `
${separator}
              KRIDA — BOOKING RECEIPT
${separator}

Booking ID:    ${booking.id}
Date:          ${formatDate(booking.createdAt)}

─── PLAYER ────────────────────────────────────
Name:          ${user.name}
Email:         ${user.email}
Phone:         ${user.phone || 'N/A'}

─── VENUE ─────────────────────────────────────
Venue:         ${venue.name}
Sport:         ${booking.slot ? venue.sport.charAt(0).toUpperCase() + venue.sport.slice(1) : 'N/A'}
Address:       ${venue.address}, ${venue.city}

─── BOOKING DETAILS ───────────────────────────
Date:          ${formatDate(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Time:          ${booking.slot}
Duration:      ${booking.hours} hour${booking.hours > 1 ? 's' : ''}
Players:       ${booking.players ?? 1}

─── PAYMENT ───────────────────────────────────
Amount:        ${formatPrice(booking.price)}
Method:        ${booking.paymentMethod ?? 'Razorpay'}
Payment ID:    ${booking.paymentId ?? 'N/A'}
Status:        ${booking.status.toUpperCase()}

${line}
Thank you for booking with KRIDA!
For support: support@krida.app
${separator}
`
}

export function downloadReceipt(booking: Booking, venue: Venue, user: User) {
  const text = generateReceiptText(booking, venue, user)
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
